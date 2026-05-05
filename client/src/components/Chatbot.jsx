import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import {
  Send,
  X,
  Bot,
  Calendar,
  PhoneCall,
  MapPin,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${user?.name}, I am your AI Health Assistant. How can I help you today?`,
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
    // Fetch location automatically
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.warn(err, "Location access denied"),
    );
  }, [messages, isTyping]);

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
      // API call using POST to handle symptom, location, and history
      const res = await api.post("/advice", {
        symptom: userText,
        lat: location.lat,
        lng: location.lng,
        history: chatHistory,
      });

      if (res.data && res.data.length > 0) {
        // --- MULTI-MATCH INTEGRATION START ---
        // Combine all advice found into one structured message
        const combinedText = res.data
          .map((item) => item.advice_text)
          .join("\n\n---\n\n");
        const firstMatch = res.data[0];

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              text: combinedText,
              sender: "bot",
              severity: firstMatch.severity,
              map: firstMatch.hospital_link, // 'map' used in escalation buttons below
            },
          ]);
          setIsTyping(false);
        }, 800);
        // --- MULTI-MATCH INTEGRATION END ---
      } else {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: "I couldn't find specific advice. Please book a doctor.",
            sender: "bot",
            severity: "unknown",
          },
        ]);
      }
    } catch (err) {
      console.error("Frontend Chat Error:", err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm having trouble connecting to the medical server. Please try again or seek direct help.",
          sender: "bot",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] md:bottom-8">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all flex items-center gap-2 group border-4 border-white"
        >
          <Bot
            size={28}
            className="group-hover:rotate-12 transition-transform"
          />
          <span className="hidden md:block font-black text-xs uppercase tracking-widest px-2">
            Ask AI Assistant
          </span>
        </button>
      ) : (
        <div className="bg-white w-[350px] sm:w-[420px] h-[450px] rounded-[45px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-2xl shadow-lg">
                <Activity size={20} />
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest leading-none mb-1">
                  HealthSync AI
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <p className="text-[9px] font-bold uppercase opacity-80">
                    Medical Assistant
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-[26px] text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none shadow-blue-200"
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  }`}
                >
                  {m.text}

                  {/* SMART ESCALATION OPTIONS - Combined Logic */}
                  {m.sender === "bot" && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-2">
                      <Link
                        to="/book"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-md hover:bg-blue-700 transition"
                      >
                        <Calendar size={14} /> Book Specialist
                      </Link>

                      <a
                        href={
                          m.map ||
                          "https://www.google.com/maps/search/hospital+near+me"
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 py-2.5 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-200 transition"
                      >
                        <MapPin size={14} /> Nearest Hospital
                      </a>

                      {m.severity === "emergency" && (
                        <a
                          href="tel:911"
                          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-2xl font-black text-[9px] uppercase shadow-lg shadow-red-200 animate-pulse"
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
              <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest animate-pulse ml-2 flex items-center gap-2">
                <Bot size={14} /> AI is processing...
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
              placeholder="Ask anything about your health..."
              className="flex-1 bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-600 font-medium text-slate-700"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
