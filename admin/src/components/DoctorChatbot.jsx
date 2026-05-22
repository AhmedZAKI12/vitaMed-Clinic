import React, { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { DoctorContext } from "../context/DoctorContext";

const DoctorChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello Doctor! I am your AI assistant. How can I help you manage your schedule today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { dToken, backendUrl, getAppointments } = useContext(DoctorContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Fetch Doctor's active appointments context
      let doctor_appointments = [];
      if (dToken) {
        try {
          const apptRes = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } });
          if (apptRes.data.success) {
             doctor_appointments = apptRes.data.appointments
               .map(appt => ({
                 id: appt._id,
                 patientName: appt.userData.name,
                 date: appt.slotDate,
                 time: appt.slotTime,
                 isCompleted: appt.isCompleted,
                 cancelled: appt.cancelled
               }));
          }
        } catch(e) { console.error("Could not fetch appointments context", e); }
      }

      // Prepare Chat History (skip the greeting message at index 0 to save tokens, keep last 6)
      const historyToSend = messages.slice(1).slice(-6).map(m => `${m.sender === 'user' ? 'Doctor' : 'Assistant'}: ${m.text}`);

      // Send request to Python AI Microservice
      const response = await axios.post("http://localhost:8000/api/doctor-chat", {
        user_message: userMessage.text,
        doctor_appointments: doctor_appointments,
        chat_history: historyToSend
      });

      let botText = response.data.response;

      // Intercept Confirm Action
      const confirmMatch = botText.match(/\[CONFIRM_ACTION\]\s*(\{.*?\})/s);
      if (confirmMatch) {
        try {
          botText = botText.replace(confirmMatch[0], "").trim();
          const { appointmentId } = JSON.parse(confirmMatch[1]);
          
          if (!dToken) {
             botText += "\n\n⚠️ Error: You are not logged in.";
          } else {
             const confirmRes = await axios.post(backendUrl + '/api/doctor/confirm-appointment', { appointmentId }, { headers: { dToken } });
             if (confirmRes.data.success) {
                botText += "\n\n✅ **Appointment Confirmed!** I have successfully updated the status.";
             } else {
                botText += "\n\n❌ **Failed:** " + confirmRes.data.message;
             }
          }
        } catch(e) { console.error("Confirm parse err", e); }
      }

      // Intercept Cancel Action
      const cancelMatch = botText.match(/\[CANCEL_ACTION\]\s*(\{.*?\})/s);
      if (cancelMatch) {
        try {
          botText = botText.replace(cancelMatch[0], "").trim();
          const { appointmentId } = JSON.parse(cancelMatch[1]);
          if (dToken) {
             const cancelRes = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { dToken } });
             if (cancelRes.data.success) {
                botText += "\n\n✅ **Appointment Cancelled!**";
             } else {
                botText += "\n\n❌ **Failed:** " + cancelRes.data.message;
             }
          }
        } catch(e) { console.error("Cancel parse err", e); }
      }

      // Intercept Complete Action
      const completeMatch = botText.match(/\[COMPLETE_ACTION\]\s*(\{.*?\})/s);
      if (completeMatch) {
        try {
          botText = botText.replace(completeMatch[0], "").trim();
          const { appointmentId } = JSON.parse(completeMatch[1]);
          if (dToken) {
             const completeRes = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { dToken } });
             if (completeRes.data.success) {
                botText += "\n\n✅ **Appointment Marked as Completed!**";
             } else {
                botText += "\n\n❌ **Failed:** " + completeRes.data.message;
             }
          }
        } catch(e) { console.error("Complete parse err", e); }
      }
      
      if (confirmMatch || cancelMatch || completeMatch) {
        getAppointments();
      }

      const botMessage = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, an error occurred: " + (error.response?.data?.detail || error.message),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:scale-105 transition flex items-center justify-center text-2xl"
      >
        {isOpen ? "✖" : "🩺"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200" style={{ height: "500px" }}>
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 font-bold text-lg flex items-center gap-2">
            🩺 Doctor Assistant
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white self-end rounded-br-none"
                    : "bg-white border text-gray-700 self-start rounded-bl-none shadow-sm"
                }`}
                style={{ whiteSpace: "pre-line" }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white border text-gray-400 self-start p-3 rounded-2xl rounded-bl-none text-sm shadow-sm animate-pulse">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorChatbot;
