import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { Send, MessageSquare, User } from "lucide-react";

const AppointmentChat = ({ appointmentId, senderRole }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`/appointments/${appointmentId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Chat Error:", err.message);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll for new messages every 5 seconds
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      await api.post(`/appointments/${appointmentId}/message`, {
        message_text: newMessage,
      });
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 mt-4 flex flex-col h-[400px]">
      <div className="flex items-center gap-2 mb-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
        <MessageSquare size={14} /> Consultation Chat
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender_role === senderRole ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender_role === senderRole
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
              }`}
            >
              {msg.message_text}
            </div>
            <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold">
              {msg.sender_name} •{" "}
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="relative">
        <input
          type="text"
          placeholder="Type your reply..."
          className="w-full p-4 pr-14 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          disabled={loading}
          className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AppointmentChat;
