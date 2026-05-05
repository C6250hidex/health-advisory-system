import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  Calendar,
  PhoneCall,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.name}, I am your AI Health Assistant. How can I help you?`,
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const chatEndRef = useRef(null);

  // 1. GUARD: ONLY SHOW IF LOGGED IN
  if (!user) return null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, [messages, isTyping]);

  // // Find your handleSend function and update the try block to this:
  // const handleSend = async (e) => {
  //   e.preventDefault();
  //   if (!input.trim()) return;

  //   const userMsg = { id: Date.now(), text: input, sender: "user" };
  //   setMessages((prev) => [...prev, userMsg]);
  //   setInput("");
  //   setIsTyping(true);

  //   try {
  //     const res = await api.get(
  //       `/advice?symptom=${encodeURIComponent(userMsg.text)}&lat=${location.lat}&lng=${location.lng}`,
  //     );

  //     const botData = res.data[0];

  //     setTimeout(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           id: Date.now() + 1,
  //           text: botData.advice_text,
  //           sender: "bot",
  //           severity: botData.severity,
  //           map: botData.hospital_link, // CRITICAL: You were missing this line!
  //         },
  //       ]);
  //       setIsTyping(false);
  //     }, 800);
  //   } catch (err) {
  //     console.error(err);
  //     setIsTyping(false);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now(),
  //         text: "System Error. Please try again.",
  //         sender: "bot",
  //       },
  //     ]);
  //   }
  // };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    const userMsg = { id: Date.now(), text: userText, sender: "user" };

    // Format history for the backend (Gemini requirement)
    const chatHistory = messages.map((m) => ({
      role: m.sender === "bot" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // API call must be POST
      const res = await api.post("/advice", {
        symptom: userText,
        lat: location.lat,
        lng: location.lng,
        history: chatHistory,
      });

      if (res.data && res.data.length > 0) {
        const botData = res.data[0];
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: botData.advice_text,
            sender: "bot",
            severity: botData.severity,
            map: botData.hospital_link,
          },
        ]);
      }
    } catch (err) {
      console.error("Frontend Chat Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:bottom-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2"
        >
          <MessageCircle size={28} />
          <span className="hidden md:block font-bold text-sm">
            Ask AI Assistant
          </span>
        </button>
      ) : (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Bot className="p-1 bg-white/20 rounded-lg" size={32} />
              <div>
                <h4 className="font-black text-sm tracking-tight">
                  HealthSync AI
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-bold uppercase opacity-80">
                    Triage Active
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white/10 p-2 rounded-xl hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-[26px] text-sm leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  }`}
                >
                  {m.text}

                  {/* SMART ESCALATION OPTIONS */}
                  {m.sender === "bot" && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-2">
                      <Link
                        to="/book"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg"
                      >
                        <Calendar size={14} /> Book Verification
                      </Link>
                      <a
                        href={m.map}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-2.5 rounded-2xl font-black text-[9px] uppercase tracking-widest"
                      >
                        <MapPin size={14} /> Nearest Hospital
                      </a>
                      {m.severity === "emergency" && (
                        <a
                          href="tel:911"
                          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-2xl font-black text-[9px] uppercase shadow-lg shadow-red-200"
                        >
                          <PhoneCall size={14} /> Emergency Hotline
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-[10px] text-blue-600 font-bold ml-2 animate-pulse flex items-center gap-1">
                <Bot size={12} /> AI is analyzing symptoms...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-4 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              placeholder="Describe your symptoms..."
              className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
