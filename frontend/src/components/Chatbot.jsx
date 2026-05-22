import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Chatbot = () => {
  const { token, userData, backendUrl, getDoctosData } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am VitaMed's virtual assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Fetch user's active appointments context
      let user_appointments = [];
      if (token) {
        try {
          const apptRes = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } });
          if (apptRes.data.success) {
             user_appointments = apptRes.data.appointments
               .filter(appt => !appt.cancelled && !appt.isCompleted)
               .map(appt => ({
                 id: appt._id,
                 doctor: appt.docData.name,
                 date: appt.slotDate,
                 time: appt.slotTime
               }));
          }
        } catch(e) { console.error("Could not fetch appointments context", e); }
      }

      // Prepare Chat History (skip the greeting message at index 0 to save tokens, keep last 6)
      const historyToSend = messages.slice(1).slice(-6).map(m => `${m.sender === 'user' ? 'Patient' : 'Assistant'}: ${m.text}`);

      // Send request to Python AI Microservice
      const response = await axios.post("http://localhost:8000/api/chat", {
        user_message: userMessage.text,
        user_appointments: user_appointments,
        chat_history: historyToSend
      });

      let botText = response.data.response;
      
      // Intercept Action Commands systematically via Regex
      const cancelMatch = botText.match(/\[CANCEL_ACTION\]\s*(\{.*?\})/s);
      if (cancelMatch) {
        try {
          botText = botText.replace(cancelMatch[0], "").trim();
          const { appointmentId } = JSON.parse(cancelMatch[1]);
          
          if (!token || !userData) {
             botText += "\n\n⚠️ Please log in to manage your appointments.";
          } else {
             const cancelRes = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } });
             if (cancelRes.data.success) {
                botText += "\n\n🗑️ **Cancellation Confirmed.** The appointment has been successfully removed.";
             } else {
                botText += "\n\n❌ **Cancellation Failed:** " + cancelRes.data.message;
             }
          }
        } catch(e) { console.error("Cancel parse err", e); }
      }

      const bookMatch = botText.match(/\[BOOK_ACTION\]\s*(\{.*?\})/s);
      if (bookMatch) {
        try {
          botText = botText.replace(bookMatch[0], "").trim();
          const actionData = JSON.parse(bookMatch[1]);
          
          if (!token || !userData) {
             if (!botText.includes("Please log in")) botText += "\n\n⚠️ **Registration Required:** Please log in first at http://localhost:5173/login to confirm your booking!";
          } else {
             const bookingData = { userId: userData._id, docId: actionData.docId, slotDate: actionData.slotDate, slotTime: actionData.slotTime };
             const bookRes = await axios.post(backendUrl + '/api/user/book-appointment', bookingData, { headers: { token } });
             if (bookRes.data.success) {
                botText += "\n\n🎉 **Booking Confirmed!** I have successfully reserved this slot for you.";
             } else {
                botText += "\n\n❌ **Booking Failed:** " + bookRes.data.message;
             }
          }
        } catch(e) { console.error("Book parse err", e); }
      }
      
      // If any actions occurred, refresh frontend doctors state
      if (cancelMatch || bookMatch) {
        getDoctosData();
      }

      const botMessage = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Execution Error:", error);
      const errorMessage = {
        sender: "bot",
        text: `Sorry, an error occurred during execution: ${error.message}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] mb-4 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <h3 className="font-semibold tracking-wide">VitaMed Assistant</h3>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200 transition-colors">
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50/50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-white self-end rounded-br-sm shadow-sm"
                    : "bg-white text-gray-800 border border-gray-200 self-start rounded-bl-sm shadow-sm whitespace-pre-line"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-white text-gray-500 border border-gray-200 self-start p-3 rounded-2xl rounded-bl-sm text-sm flex gap-1 shadow-sm">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-75">●</span>
                <span className="animate-bounce delay-150">●</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none text-sm transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen ? "rotate-90 hidden" : "block"}`}
      >
        <span className="text-2xl">🤖</span>
      </button>
    </div>
  );
};

export default Chatbot;
