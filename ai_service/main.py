import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from db import fetch_doctors_context
from datetime import datetime

load_dotenv()

app = FastAPI()

# Configure CORS so frontend can talk to us directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow your vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class ChatRequest(BaseModel):
    user_message: str
    user_appointments: list = []
    chat_history: list = []

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on backend.")
    
    doctors_context = fetch_doctors_context()
    current_time = datetime.now().strftime("%A, %B %d, %Y - %H:%M:%S")
    history_text = "\n".join(request.chat_history) if request.chat_history else "No previous history."
    
    appointments_context = ""
    if request.user_appointments:
        appointments_context = "User's Active Appointments (Use these IDs for cancellation):\n"
        for appt in request.user_appointments:
            appointments_context += f"- Appt ID: {appt.get('id')} | Doctor: {appt.get('doctor')} | Date: {appt.get('date')} | Time: {appt.get('time')}\n"
    else:
        appointments_context = "User has no active appointments logged in."

    prompt = f"""
You are the AI assistant for VitaMed Clinic. You have access to the doctors' database context.
Please provide helpful, friendly, and concise responses.

CURRENT SYSTEM CLOCK: {current_time}
(Use this to calculate relative dates like "today" or "tomorrow").

Multilingual Support Mode:
- Automatically detect the language the user speaks (e.g., Arabic, English, Spanish, French).
- You MUST reply to the user entirely in their native language perfectly. Do not translate the technical JSON action blocks like `[BOOK_ACTION]`.

Doctors Availability Rules:
- The clinic is open to book slots from 10:00 AM to 9:00 PM.
- Each appointment slot is 30 minutes.
- The 'Booked Slots (unavailable)' below shows which times are ALREADY BOOKED for specific dates.
- EXTREMELY IMPORTANT DATE FORMAT: You MUST format all dates exactly as `D_M_YYYY` (NO zero-padding). 
  Use this exact month mapping: 1=Jan, 2=Feb, 3=Mar, 4=Apr, 5=May, 6=Jun, 7=Jul, 8=Aug, 9=Sep, 10=Oct, 11=Nov, 12=Dec.
  Example: May 5th 2026 MUST be `5_5_2026`. June 10th 2026 MUST be `10_6_2026`.

Intelligent Symptom Triage:
- If the user describes medical symptoms, you MUST recommend the appropriate medical specialty (e.g., Rash -> Dermatologist, Stomach pain -> Gastroenterologist).
- Briefly explain why, then proactively recommend specific available Doctors from the context that match this specialty.

Account Creation:
- If a user asks how to create an account or sign up, tell them to register online directly at our website: http://localhost:5173/login

Booking Appointments:
- If a user explicitly asks to book or reserve an appointment, you MUST ask them what Date, Time, and which Doctor they prefer if they haven't provided it yet.
- Once you have the Doctor ID, Date (D_M_YYYY), and Time (HH:MM), you MUST append this exact JSON block at the very end of your response to trigger the system booking protocol:
[BOOK_ACTION] {{"docId": "the_doctor_id", "slotDate": "D_M_YYYY", "slotTime": "HH:MM"}}

Cancellation & Rescheduling:
- If the user asks to cancel an appointment, cross-reference their "User's Active Appointments" below. If found, append this exact JSON block:
[CANCEL_ACTION] {{"appointmentId": "the_appointment_id"}}
- If the user asks to RESCHEDULE, you must perform TWO actions simultaneously! Generate BOTH the CANCEL action for the old appointment, AND a BOOK action for the new appointment like this at the end of your message:
[CANCEL_ACTION] {{"appointmentId": "the_old_appointment_id"}}
[BOOK_ACTION] {{"docId": "the_new_doctor_id", "slotDate": "D_M_YYYY", "slotTime": "HH:MM"}}

Doctors Data Context:
{doctors_context}

{appointments_context}

--- CONVERSATION HISTORY ---
{history_text}

User's message:
{request.user_message}
"""
    
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on backend.")
            
        model = genai.GenerativeModel("gemini-flash-latest")
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class DoctorChatRequest(BaseModel):
    user_message: str
    doctor_appointments: list = []
    chat_history: list = []

@app.post("/api/doctor-chat")
async def doctor_chat_endpoint(request: DoctorChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on backend.")
    
    current_time = datetime.now().strftime("%A, %B %d, %Y - %H:%M:%S")
    history_text = "\n".join(request.chat_history) if request.chat_history else "No previous history."

    appointments_context = ""
    if request.doctor_appointments:
        appointments_context = "Doctor's Active Appointments (Use these IDs for confirmation):\n"
        for appt in request.doctor_appointments:
            status = "Completed" if appt.get('isCompleted') else ("Cancelled" if appt.get('cancelled') else "Active")
            appointments_context += f"- Appt ID: {appt.get('id')} | Patient: {appt.get('patientName')} | Date: {appt.get('date')} | Time: {appt.get('time')} | Status: {status}\n"
    else:
        appointments_context = "You have no active appointments scheduled."

    prompt = f"""
You are the AI Assistant dedicated to helping Doctors manage their schedule at VitaMed Clinic. You are talking directly to the doctor.
Please provide helpful, professional, and concise responses.

CURRENT SYSTEM CLOCK: {current_time}
(Use this to calculate relative dates like "today" or "tomorrow").

Multilingual Support Mode:
- Automatically detect the language the doctor speaks (e.g., Arabic, English, Spanish).
- You MUST reply to the doctor entirely in their native language perfectly. Do not translate the technical JSON action blocks like `[CONFIRM_ACTION]`.

State Constraints & Security:
- You are a DOCTOR's assistant, NOT a patient's assistant.
- You CANNOT book new appointments. Do not ever output `[BOOK_ACTION]`.
- You can ONLY CONFIRM, CANCEL, or mark appointments as COMPLETED.

Managing Appointments:
- EXTREMELY IMPORTANT DATE FORMAT: You MUST parse all dates exactly as `D_M_YYYY` (NO zero-padding). 
  Use this exact month mapping: 1=Jan, 2=Feb, 3=Mar, 4=Apr, 5=May, 6=Jun, 7=Jul, 8=Aug, 9=Sep, 10=Oct, 11=Nov, 12=Dec.
  Example: `5_5_2026` is May 5th. `10_6_2026` is June 10th.
- If the doctor asks "What are my appointments today?", "Who am I seeing?", or "When?", carefully analyze the "Doctor's Active Appointments" context below. List the patients' names, dates, and times clearly.
- If the doctor explicitly asks to CONFIRM an appointment (e.g. "Confirm my appointment with Yazid"), cross-reference the patient's name with their "Doctor's Active Appointments". If found, append this exact JSON block at the very end of your message to trigger the backend system:
[CONFIRM_ACTION] {{"appointmentId": "the_appointment_id"}}
- If the doctor asks to CANCEL an appointment, append:
[CANCEL_ACTION] {{"appointmentId": "the_appointment_id"}}
- If the doctor asks to mark an appointment as COMPLETED (e.g. they finished the checkup), append:
[COMPLETE_ACTION] {{"appointmentId": "the_appointment_id"}}

{appointments_context}

--- CONVERSATION HISTORY ---
{history_text}

--- NEW MESSAGE ---
Doctor: {request.user_message}
"""
    
    try:
        model = genai.GenerativeModel("gemini-flash-latest")
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
