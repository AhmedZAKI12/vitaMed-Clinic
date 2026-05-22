import sys
import subprocess

try:
    import docx
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "python-docx"])
    import docx

from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# Title
title = doc.add_heading('VitaMed Clinic - Comprehensive Healthcare Platform', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER
doc.add_paragraph('\n')

# 1. Executive Summary & Problem Statement
doc.add_heading('1. Executive Summary & Problem Statement', level=1)
doc.add_paragraph('Traditional clinic management relies heavily on manual phone calls, physical paper records, and over-burdened receptionists. This often leads to double-booked time slots, frustrated patients waiting on hold, and inefficient data retrieval.')
doc.add_paragraph('VitaMed Clinic solves this by introducing a state-of-the-art, full-stack healthcare management platform. The system digitizes the entire medical appointment lifecycle. It provides patients with an intuitive portal for self-service booking, offers doctors a dedicated panel to manage their availability, and introduces a cutting-edge Autonomous AI Medical Assistant to streamline triage and reservations without human intervention.')

# 2. System Architecture & Tech Stack
doc.add_heading('2. System Architecture & Technology Stack', level=1)
doc.add_paragraph('The platform utilizes a robust, decoupled architecture combining the MERN stack with a Python microservice to achieve maximum scalability and separation of concerns.')

doc.add_heading('A. Frontend Client (React & Vite)', level=2)
doc.add_paragraph('The frontend is a Single Page Application (SPA) built with React.js and compiled using Vite for lightning-fast hot module replacement and optimized production builds. It uses TailwindCSS for responsive, mobile-first styling and Context API for global state management across the Patient and Admin portals.')

doc.add_heading('B. Backend Core API (Node.js & Express)', level=2)
doc.add_paragraph('The central nervous system of the application. It follows the MVC (Model-View-Controller) design pattern. The Node.js server handles all complex business logic, RESTful API routing, image uploading via Cloudinary, and dispatching automated email notifications via NodeMailer.')

doc.add_heading('C. AI Microservice (Python & FastAPI)', level=2)
doc.add_paragraph('A dedicated, non-blocking engine powered by Google Gemini (gemini-1.5-flash). By offloading AI text generation to a separate Python server using FastAPI and Uvicorn, the main Node.js server is protected from heavy computational loads or network timeouts.')

doc.add_heading('D. Database (MongoDB Atlas)', level=2)
doc.add_paragraph('A highly scalable NoSQL database hosted in the cloud. It utilizes Mongoose ODM to enforce strict schemas for Users, Doctors, and Appointments, ensuring data integrity across relations.')

# 3. Deep Dive: Core Modules
doc.add_heading('3. Deep Dive: Core Modules', level=1)

doc.add_heading('Module 1: The Patient Portal', level=2)
doc.add_paragraph('• Secure Authentication: Patients register and log in using JWT (JSON Web Tokens). Passwords are mathematically salted and hashed using Bcrypt before ever hitting the database.\n• Dynamic Filtering: Patients can browse doctors based on specialized medical fields (General Physician, Neurologist, Dermatologist, etc.).\n• Interactive Scheduling: The system mathematically subtracts a doctor\'s "slots_booked" array from the clinic\'s operating hours (10:00 AM - 9:00 PM) to only display available 30-minute booking windows.\n• Review System: Patients can rate their experience (1-5 stars) and write reviews, which dynamically recalculates the doctor\'s aggregate rating.')

doc.add_heading('Module 2: The Admin & Doctor Portals', level=2)
doc.add_paragraph('• Staff Management: Administrators have God-view access to add new doctors, upload their profile images to the Cloudinary CDN, and adjust their consultation fees.\n• Financial & Appointment Tracking: Real-time calculation of total clinic revenue and an overview of all system-wide active/cancelled appointments.\n• Doctor Autonomy: Doctors can log in to view their specific patient roster, mark appointments as completed, and adjust their calendar availability.')

doc.add_heading('Module 3: The Doctor AI Assistant', level=2)
doc.add_paragraph('To ensure doctors can efficiently manage their workload, the system implements a secondary, highly secure AI pipeline exclusively for authenticated medical staff. This AI acts as a dedicated personal secretary.')
doc.add_paragraph('• Schedule Analysis & Retrieval: The AI securely parses the doctor\'s active appointments and answers conversational questions like "Who am I seeing today?".\n• Autonomous Action Confirmation: The AI can execute backend commands. If the doctor types "Confirm my appointment with John", the AI cross-references the patient\'s name, generates a [CONFIRM_ACTION] hidden payload, and the React Admin frontend intercepts it to securely update the database using the Doctor\'s JWT token.')

# 4. Deep Dive: The Patient AI Medical Assistant
doc.add_heading('4. Deep Dive: The AI Medical Assistant', level=1)
doc.add_paragraph('The most advanced feature of the VitaMed platform is the autonomous chatbot. It acts as a 24/7 digital receptionist.')

doc.add_paragraph('• Intelligent Symptom Triage: Evaluates patient symptoms using natural language processing (NLP). If a patient complains of a "severe toothache", the AI autonomously recommends the Dentistry department and pulls available Dentists from the live database context.\n• Autonomous Database Writes: The AI generates secure JSON action payloads (e.g., [BOOK_ACTION]) to reserve time slots. \n• Smart Rescheduling (Dual-Action Execution): If a patient requests to reschedule, the AI cross-references their active appointments via the React context, systematically generates a [CANCEL_ACTION] for the old slot, and simultaneously generates a [BOOK_ACTION] for the new slot in a single processing loop.\n• Native Multilingual Translation: The AI detects the language of the prompt (Arabic, French, Spanish) and replies fluently in that exact language, while still preserving the underlying English JSON syntax required for backend execution.')

# 5. Security & Data Flow
doc.add_heading('5. Security & The "Middleman" Pattern', level=1)
doc.add_paragraph('Security is paramount in healthcare applications. To prevent vulnerabilities, the system employs the "Middleman Interception Pattern".')
doc.add_paragraph('The Python AI Microservice is strictly prohibited from executing database writes directly. It only has "Read" access to Doctor availability. When the AI determines an appointment should be booked, it sends the action code back to the React Frontend.')
doc.add_paragraph('The React Frontend acts as the secure middleman. It intercepts the hidden AI code, attaches the patient\'s secure HTTP-Only JWT token, and sends a standard booking request to the Node.js API. This guarantees that all bookings go through the exact same security checks, token validations, and double-booking preventions as if a human clicked the button.')

# 6. Future Enhancements
doc.add_heading('6. Future Enhancements Roadmap', level=1)
doc.add_paragraph('• Stripe Payment Integration: Requiring patients to pay their consultation fees securely online before an appointment is confirmed.\n• WebRTC Video Consultations: Enabling doctors to host remote telehealth video calls directly within the platform.\n• EMR (Electronic Medical Records): Allowing doctors to attach private PDF medical records and prescriptions directly to a patient\'s profile.')

# Save the document
output_path = r'C:\Users\menna\.gemini\antigravity\scratch\vitaMed-Clinic-main\VitaMed_Detailed_Project_Presentation.docx'
doc.save(output_path)
print(f"Document saved successfully to {output_path}")
