import { useState } from "react";
import api from "../services/api";
import {
  Search,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Info,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

const Advisory = () => {
  const [symptom, setSymptom] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inside Advisory.jsx
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!symptom) return;

    setLoading(true);
    setResults(null); // Clear previous
    try {
      // We use POST now to match the new backend requirement
      const res = await api.post("/advice", {
        symptom: symptom,
      });
      setResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
      toast.error("Failed to fetch health advice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. SEARCH HERO SECTION */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Activity size={14} /> AI Health Assistant
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
            How are you <span className="text-blue-600">feeling</span> today?
          </h1>
          <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            Describe your symptoms in detail. Our system will analyze your input
            and provide immediate medical guidance.
          </p>

          {/* Professional Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative max-w-2xl mx-auto group"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={24} />
            </div>
            <input
              type="text"
              placeholder="e.g. 'I have a sharp pain in my stomach and feel dizzy'"
              className="w-full p-6 pl-16 pr-32 bg-white border border-gray-200 rounded-[30px] shadow-2xl shadow-blue-100 outline-none focus:ring-4 focus:ring-blue-100 transition-all text-gray-700 text-lg"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
            <button className="absolute right-3 top-3 bottom-3 bg-blue-600 text-white px-8 rounded-[22px] font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Analyze
            </button>
          </form>
        </div>
      </section>

      {/* 2. RESULTS & INFO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT & CENTER: Results Area */}
        <div className="lg:col-span-2">
          {!results && !loading && (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[40px]">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Stethoscope size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-400">
                Your analysis will appear here.
              </h3>
              <p className="text-gray-400 mt-2">
                Start by typing your symptoms above.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center py-20">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-blue-600 font-black animate-pulse">
                Scanning Medical Knowledge Base...
              </p>
            </div>
          )}

          {results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-green-500" size={24} />
                <h2 className="text-2xl font-black text-gray-800">
                  Analysis Found
                </h2>
              </div>

              {results.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-[35px] border border-gray-100 shadow-xl shadow-gray-100/50"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                      <Info size={30} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-3 capitalize">
                        Relevant Guidance
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg italic">
                        "{item.advice_text}"
                      </p>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase">
                          Verified Advice
                        </span>
                        <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
                          Emergency: Call 911
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* CTA after results */}
              <div className="bg-blue-600 p-8 rounded-[35px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-200">
                <div>
                  <h4 className="text-xl font-bold">Still feeling unwell?</h4>
                  <p className="text-blue-100 opacity-80 text-sm">
                    Speak with a certified specialist within minutes.
                  </p>
                </div>
                <a
                  href="/book"
                  className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition"
                >
                  Book Appointment <ArrowRight size={18} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: MEDICAL STANDARDS SIDEBAR */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-50 p-8 rounded-[35px] border border-gray-100">
            <h4 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-600" /> Usage
              Guidelines
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="text-blue-600 font-bold">01.</div>
                Be specific about your symptoms (duration, intensity).
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="text-blue-600 font-bold">02.</div>
                Mention any existing medical conditions or medications.
              </li>
              <li className="flex gap-3 text-sm text-gray-600">
                <div className="text-blue-600 font-bold">03.</div>
                This tool is for information, not a final diagnosis.
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-8 rounded-[35px] border border-red-100">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={24} />
              <h4 className="font-black text-lg">Emergency</h4>
            </div>
            <p className="text-red-700 text-sm leading-relaxed">
              If you are experiencing chest pain, severe difficulty breathing,
              or sudden numbness, call your local emergency services
              immediately.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple icon for guidelines (Missing in lucide-react standard import above)
const ShieldCheck = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Advisory;
