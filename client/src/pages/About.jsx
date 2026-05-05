import {
  Target,
  ShieldCheck,
  Users,
  Award,
  HeartPulse,
  Globe,
  Activity,
} from "lucide-react";

const About = () => {
  return (
    <div className="bg-white  min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Globe
            className="absolute -right-20 -bottom-20 text-white"
            size={400}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Redefining Healthcare{" "}
            <span className="text-blue-500">Accessibility.</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            HealthSync is a digital health ecosystem designed to bridge the gap
            between certified medical expertise and patients who need immediate,
            reliable guidance.
          </p>
        </div>
      </section>

      {/* 2. MISSION & VISION */}
      <section className="max-w-6xl mx-auto py-24 px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black uppercase mb-6">
            <Target size={16} /> Our Mission
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
            Empowering Patients Through Technology.
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            We believe that quality medical advice shouldn't be a luxury. By
            utilizing modern web technology and secure data management, we
            provide a platform where symptoms are analyzed instantly and
            consultations are booked without the traditional waiting room
            friction.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-black text-2xl text-blue-600">50k+</h4>
              <p className="text-sm text-slate-400 font-bold uppercase">
                Consultations
              </p>
            </div>
            <div>
              <h4 className="font-black text-2xl text-blue-600">99.9%</h4>
              <p className="text-sm text-slate-400 font-bold uppercase">
                Server Uptime
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 shadow-inner">
          <HeartPulse className="text-blue-600 mb-6" size={48} />
          <h3 className="text-2xl font-black text-slate-800 mb-4">
            The Vision
          </h3>
          <p className="text-slate-500 leading-relaxed italic">
            "To become the world's most trusted first-point-of-contact for
            non-emergency medical concerns, ensuring every human has a verified
            doctor in their pocket."
          </p>
        </div>
      </section>

      {/* 3. CORE VALUES GRID */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Our Core Principles
          </h2>
          <p className="text-slate-500 mt-4 font-medium">
            The foundation of everything we build at HealthSync.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <ValueCard
            icon={<ShieldCheck size={32} />}
            title="Privacy First"
            desc="Your medical records are encrypted and only accessible to you and your chosen physician."
          />
          <ValueCard
            icon={<Award size={32} />}
            title="Certified Experts"
            desc="Every doctor on our platform undergoes a rigorous background and license verification process."
          />
          <ValueCard
            icon={<Users size={32} />}
            title="Patient-Centric"
            desc="We design our interfaces for human beings, ensuring ease of use for all age groups."
          />
        </div>
      </section>

      {/* 4. JOIN US CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-[50px] p-12 md:p-20 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
          <Activity
            className="absolute -left-10 -bottom-10 opacity-10"
            size={200}
          />
          <h2 className="text-3xl md:text-5xl font-black mb-6">
            Ready to prioritize your health?
          </h2>
          <p className="text-blue-100 text-lg mb-10">
            Join thousands of others who have simplified their medical journey.
          </p>
          <a
            href="/register"
            className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform inline-block"
          >
            Create Free Account
          </a>
        </div>
      </section>
    </div>
  );
};

// Sub-component for Principles
const ValueCard = ({ icon, title, desc }) => (
  <div className="bg-white p-10 rounded-[35px] shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group">
    <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tighter">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);

export default About;
