import { Link } from "react-router-dom";
import {
  Stethoscope,
  Calendar,
  ChevronDown,
  ArrowRight,
  Activity,
  PhoneCall,
  CheckCircle,
  Users,
  Star,
  Globe,
  Lock,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-white flex flex-col items-center">
      {/* 1. HERO SECTION - With Subtle Pattern */}
      <section className="relative w-full px-6 py-20 md:py-32 bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col items-center text-center overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-200">
            <Activity size={16} /> Trusted by 5,000+ Patients
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] max-w-4xl tracking-tight">
            The Smart Way to <span className="text-blue-600">Consult</span> with
            Your Doctor.
          </h1>

          <p className="mt-8 text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Get instant health advice and skip the queue. Connect with top-rated
            medical professionals from the comfort of your home.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center mx-auto">
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-bold shadow-2xl shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
                >
                  Join HealthSync <ArrowRight size={20} />
                </Link>
                <Link
                  to="/advisory"
                  className="bg-white text-gray-800 border border-gray-200 px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-blue-400 transition-all duration-300"
                >
                  Check Symptoms
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold shadow-2xl shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                Go to My Dashboard <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </section>
      {/* 2. SPECIALIZATION GRID (New) */}
      <section className="w-full max-w-7xl px-6 py-24 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Top Specialists
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Connect with experts across various medical fields.
            </p>
          </div>
          <Link
            to="/book"
            className="text-blue-600 font-black text-sm uppercase flex items-center gap-2 hover:underline"
          >
            View All Doctors <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SpecialtyCard
            icon={<Activity />}
            label="General"
            color="bg-blue-50 text-blue-600"
          />
          <SpecialtyCard
            icon={<Users />}
            label="Pediatrics"
            color="bg-emerald-50 text-emerald-600"
          />
          <SpecialtyCard
            icon={<Lock />}
            label="Urology"
            color="bg-purple-50 text-purple-600"
          />
          <SpecialtyCard
            icon={<Stethoscope />}
            label="Cardiology"
            color="bg-rose-50 text-rose-600"
          />
          <SpecialtyCard
            icon={<Globe />}
            label="Neurology"
            color="bg-amber-50 text-amber-600"
          />
          <SpecialtyCard
            icon={<MessageSquare />}
            label="Mental Health"
            color="bg-indigo-50 text-indigo-600"
          />
        </div>
      </section>
      {/* 3. VALUE PROPOSITION SECTION */}
      <section className="w-full bg-gray-900 py-24 px-6 overflow-hidden relative">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-white">
            <h2 className="text-4xl font-black leading-tight">
              Why Leading Medical Professionals Choose HealthSync.
            </h2>
            <p className="mt-6 text-gray-400 text-lg">
              We provide a secure, encrypted platform that handles scheduling,
              patient records, and advice history so doctors can focus on what
              matters: Healing.
            </p>

            <ul className="mt-10 space-y-4">
              <li className="flex items-center gap-3 text-gray-200">
                <CheckCircle size={20} className="text-blue-500" /> End-to-end
                Encrypted Patient Data
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <CheckCircle size={20} className="text-blue-500" /> Automated
                Schedule Management
              </li>
              <li className="flex items-center gap-3 text-gray-200">
                <CheckCircle size={20} className="text-blue-500" /> Direct
                Patient Communication
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-8 rounded-3xl mt-8">
              <h4 className="text-blue-400 text-4xl font-black">99%</h4>
              <p className="text-gray-400 text-sm mt-2">Patient Satisfaction</p>
            </div>
            <div className="bg-blue-600 p-8 rounded-3xl">
              <h4 className="text-white text-4xl font-black">2min</h4>
              <p className="text-blue-100 text-sm mt-2">Avg. Booking Time</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-3xl">
              <h4 className="text-white text-4xl font-black">50k+</h4>
              <p className="text-gray-400 text-sm mt-2">Successful Consults</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-3xl mt-[-32px]">
              <h4 className="text-green-400 text-4xl font-black">Free</h4>
              <p className="text-gray-400 text-sm mt-2">Symptom Checking</p>
            </div>
          </div>
        </div>
      </section>
      {/* 2. HOW IT WORKS - The Process */}
      <section className="w-full max-w-6xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Your Health Journey in 3 Steps
          </h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <StepCard
            number="01"
            title="Search Symptoms"
            desc="Describe how you feel in our AI-powered advisor to get immediate preliminary guidance."
            icon={<MessageSquare size={32} />}
          />
          <StepCard
            number="02"
            title="Choose a Specialist"
            desc="Browse our directory of verified doctors and pick the one that fits your specific needs."
            icon={<Users size={32} />}
          />
          <StepCard
            number="03"
            title="Book & Consult"
            desc="Secure your time slot and meet your doctor virtually or in-person without the wait."
            icon={<Calendar size={32} />}
          />
        </div>
      </section>

      {/* PARTNERS / TRUSTED BY LOGOS */}
      <section className="w-full py-10 bg-white border-y border-gray-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="font-black text-xl text-gray-400 italic">
            WHO Standard
          </div>
          <div className="font-black text-xl text-gray-400 italic">
            GlobalHealth
          </div>
          <div className="font-black text-xl text-gray-400 italic">
            MedicalCouncil
          </div>
          <div className="font-black text-xl text-gray-400 italic">
            DataSecure
          </div>
        </div>
      </section>
      {/* 4. TESTIMONIALS */}
      <section className="w-full max-w-6xl px-6 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              What Our Patients Say
            </h2>
            <p className="text-gray-500 mt-2">
              Real stories from people who skipped the queue.
            </p>
          </div>
          <div className="flex gap-1 text-yellow-400">
            <Star fill="currentColor" /> <Star fill="currentColor" />{" "}
            <Star fill="currentColor" /> <Star fill="currentColor" />{" "}
            <Star fill="currentColor" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Sarah Jenkins"
            role="Mother of two"
            text="The symptom checker is a lifesaver. It helped me realize my son's fever wasn't an emergency but gave me the advice I needed for the night."
          />
          <TestimonialCard
            name="David Okafor"
            role="Software Engineer"
            text="Booking a specialist used to take days of phone calls. With HealthSync, I did it in 2 minutes while having lunch. Professional and fast."
          />
          <TestimonialCard
            name="Dr. Elena Rodriguez"
            role="General Physician"
            text="As a doctor, the dashboard helps me keep my day organized. My patients arrive better informed thanks to the advisory system."
          />
        </div>
      </section>
      {/* 5. FAQ SECTION (New) */}
      <section className="w-full max-w-4xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Common Questions
          </h2>
          <p className="text-slate-500 font-medium mt-2">
            Everything you need to know about our health platform.
          </p>
        </div>
        <div className="space-y-4">
          <FaqItem
            q="Is the health advice from a real doctor?"
            a="The symptom checker provides preliminary guidance based on a massive database of clinical knowledge. For final diagnosis, always book a session with our verified practitioners."
            isOpen={openFaq === 0}
            onClick={() => setOpenFaq(openFaq === 0 ? null : 0)}
          />
          <FaqItem
            q="How do I pay for appointments?"
            a="Currently, HealthSync supports direct bank transfers and online card payments. All transactions are processed through secure medical payment gateways."
            isOpen={openFaq === 1}
            onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
          />
          <FaqItem
            q="Can I access my records on multiple devices?"
            a="Yes. Your HealthSync account is cloud-synced. You can log in from any mobile, tablet, or desktop to view your medical history and chats."
            isOpen={openFaq === 2}
            onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
          />
        </div>
      </section>

      {/* 5. EMERGENCY & FOOTER (Keep existing but refine) */}
      <section className="max-w-5xl w-full px-6 py-10 text-center mb-20">
        <div className="bg-red-50 border-2 border-red-100 p-10 rounded-[40px] flex flex-col items-center shadow-xl shadow-red-50">
          <PhoneCall size={48} className="text-red-500 mb-6 animate-pulse" />
          <h2 className="text-3xl font-black text-red-700 tracking-tight">
            Need Immediate Help?
          </h2>
          <p className="text-red-600/80 mt-4 max-w-xl text-lg leading-relaxed">
            Our platform is for non-emergency advice. If you have chest pain,
            heavy bleeding, or difficulty breathing, call emergency services
            immediately.
          </p>
          <a
            href="tel:911"
            className="mt-8 bg-red-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-red-700 hover:scale-105 transition-all shadow-lg shadow-red-200"
          >
            EMERGENCY HOTLINE
          </a>
        </div>
      </section>
    </div>
  );
};
// Internal Sub-components
const SpecialtyCard = ({ icon, label, color }) => (
  <div
    className={`${color} p-6 rounded-[30px] flex flex-col items-center justify-center text-center gap-3 hover:scale-105 transition-all cursor-pointer shadow-sm`}
  >
    <div className="bg-white/50 p-3 rounded-2xl shadow-inner">{icon}</div>
    <span className="text-xs font-black uppercase tracking-tighter">
      {label}
    </span>
  </div>
);
// Sub-components for better organization
const StepCard = ({ number, title, desc, icon }) => (
  <div className="relative p-8 bg-white border border-gray-100 rounded-[32px] hover:border-blue-200 transition-all group">
    <div className="text-6xl font-black text-gray-50 absolute -top-4 -right-2 z-0 group-hover:text-blue-50 transition-colors">
      {number}
    </div>
    <div className="relative z-10">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);
const FaqItem = ({ q, a, isOpen, onClick }) => (
  <div
    className={`border rounded-[28px] overflow-hidden transition-all ${isOpen ? "border-blue-600 bg-blue-50/30" : "border-slate-100 bg-white"}`}
  >
    <button
      onClick={onClick}
      className="w-full p-6 text-left flex justify-between items-center font-bold text-slate-800"
    >
      {q}{" "}
      <ChevronDown
        className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed animate-in slide-in-from-top-2">
        {a}
      </div>
    )}
  </div>
);

const TestimonialCard = ({ name, role, text }) => (
  <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 italic text-gray-600 relative">
    <div className="text-4xl text-blue-200 absolute top-4 left-4">“</div>
    <p className="relative z-10 mb-6">{text}</p>
    <div className="flex items-center gap-4 not-italic">
      <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
      <div>
        <h5 className="text-gray-900 font-bold text-sm">{name}</h5>
        <p className="text-gray-400 text-xs">{role}</p>
      </div>
    </div>
  </div>
);

export default Home;
