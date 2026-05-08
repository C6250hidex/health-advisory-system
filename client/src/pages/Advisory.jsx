import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Search,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Info,
  ArrowRight,
  MapPin,
  Bot,
} from "lucide-react";
import toast from "react-hot-toast";

const Advisory = () => {
  const [symptom, setSymptom] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  // 1. Fetch location on mount for the hospital proximity feature
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Location access denied"),
      );
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symptom.trim()) return;

    setLoading(true);
    setResults(null);
    try {
      // 2. Sending the long string + location to the updated extraction engine
      const res = await api.post("/advice", {
        symptom: symptom,
        lat: location.lat,
        lng: location.lng,
      });

      setResults(res.data);
      toast.success(`${res.data.length} clinical match(es) found.`);
    } catch (err) {
      console.error("Search failed", err);
      toast.error("Medical intelligence system is busy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. SEARCH HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-blue-100">
            <Activity size={14} /> AI Health Assistant
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight font-serif">
            How are you <span className="text-blue-600">feeling</span> today?
          </h1>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Describe all your symptoms. Our extraction engine will identify
            every keyword and provide comprehensive guidance.
          </p>

          <form
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={24} />
            </div>
            <input
              type="text"
              placeholder="e.g. 'I am feeling cold, have body pain and a headache'"
              className="w-full p-6 pl-16 pr-32 bg-white border border-gray-200 rounded-[35px] shadow-2xl shadow-blue-100 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-700 text-lg font-medium"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
            <button
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 bg-blue-600 text-white px-8 rounded-[25px] font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>
        </div>
      </section>

      {/* 2. RESULTS & INFO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {!results && !loading && (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[40px] bg-slate-50/30">
              <div className="bg-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                <Stethoscope size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest text-xs">
                Awaiting Input
              </h3>
              <p className="text-gray-400 mt-2 font-medium">
                Your medical analysis will appear here in real-time.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-20 bg-white rounded-[40px] border border-slate-50 shadow-sm">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-600 font-black animate-pulse uppercase text-xs tracking-widest">
                Extracting Symptoms & Scanning Database...
              </p>
            </div>
          )}

          {results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={24} />
                  <h2 className="text-2xl font-black text-gray-800 tracking-tight">
                    Clinical Analysis
                  </h2>
                </div>
                <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase">
                  {results.length} Matches Found
                </span>
              </div>

              {results.map((item, index) => (
                <div
                  key={index}
                  className={`p-8 rounded-[40px] border-2 shadow-xl transition-all hover:scale-[1.01] ${
                    item.severity === "emergency"
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-blue-50 shadow-blue-50/50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                        item.severity === "emergency"
                          ? "bg-red-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {item.severity === "ai_generated" ? (
                        <Bot size={30} />
                      ) : (
                        <Info size={30} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                          {item.severity === "emergency"
                            ? "Emergency Alert"
                            : "Medical Guidance"}
                        </h3>
                        {item.severity === "ai_generated" && (
                          <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase">
                            AI Assisted
                          </span>
                        )}
                      </div>
                      <p
                        className={`leading-relaxed text-lg font-medium mb-8 ${item.severity === "emergency" ? "text-red-900" : "text-slate-600"}`}
                      >
                        "{item.advice_text}"
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={item.hospital_link}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
                        >
                          <MapPin size={14} /> Nearest Hospital
                        </a>
                        <span
                          className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                            item.severity === "emergency"
                              ? "bg-red-200 text-red-700"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          Verified Source
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* POST-ANALYSIS CTA */}
              <div className="bg-slate-900 p-10 rounded-[50px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/20 relative overflow-hidden">
                <Activity
                  className="absolute -right-10 -bottom-10 text-white/5"
                  size={200}
                />
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-2 tracking-tight">
                    Need a Professional Opinion?
                  </h4>
                  <p className="text-slate-400 font-medium">
                    Skip the queue and book a session with a specialist now.
                  </p>
                </div>
                <a
                  href="/book"
                  className="relative z-10 bg-blue-600 text-white px-10 py-4 rounded-[22px] font-black flex items-center gap-2 hover:bg-blue-700 transition shadow-xl shadow-blue-500/20"
                >
                  Book Appointment <ArrowRight size={18} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: MEDICAL STANDARDS SIDEBAR */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-inner">
            <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-600" /> Usage Policy
            </h4>
            <ul className="space-y-6">
              <SidebarItem
                number="01"
                text="Provide clear descriptions of pain levels and duration."
              />
              <SidebarItem
                number="02"
                text="Mention any chronic conditions or allergies."
              />
              <SidebarItem
                number="03"
                text="This analysis is for information only and not a diagnosis."
              />
            </ul>
          </div>

          <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 shadow-xl shadow-red-50 flex flex-col items-center text-center">
            <AlertTriangle
              size={40}
              className="text-red-500 mb-4 animate-pulse"
            />
            <h4 className="font-black text-xl text-red-700 mb-2">Emergency?</h4>
            <p className="text-red-600 text-sm leading-relaxed font-medium mb-6">
              If you have chest pain, heavy bleeding, or breathing trouble, call
              emergency services immediately.
            </p>
            <a
              href="tel:911"
              className="w-full bg-red-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg"
            >
              Call 911 Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const SidebarItem = ({ number, text }) => (
  <li className="flex gap-4 items-start">
    <div className="text-blue-600 font-black text-xs pt-1">{number}</div>
    <p className="text-slate-600 text-sm font-medium leading-relaxed">{text}</p>
  </li>
);

// Custom ShieldCheck Icon
const ShieldCheck = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Advisory;
