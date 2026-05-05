import {
  Search,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Activity,
  Smartphone,
} from "lucide-react";

const Services = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. HEADER SECTION */}
      <section className="bg-blue-50/50 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight font-serif">
          Healthcare Made Simple.
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          We’ve combined medical expertise with modern technology to provide you
          with the fastest path to recovery.
        </p>
      </section>

      {/* 2. SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <ServiceCard
          icon={<Search size={32} />}
          title="Instant Symptom Checker"
          desc="Input your symptoms and receive verified preliminary guidance based on a massive database of medical knowledge."
        />
        <ServiceCard
          icon={<Calendar size={32} />}
          title="Specialist Booking"
          desc="Book virtual or in-person sessions with certified pediatricians, surgeons, cardiologists, and more."
        />
        <ServiceCard
          icon={<MessageSquare size={32} />}
          title="Direct Doctor Chat"
          desc="Communicate directly with your physician before and after your appointment for follow-up questions."
        />
        <ServiceCard
          icon={<ShieldCheck size={32} />}
          title="Encrypted Records"
          desc="Your medical history is stored with bank-grade encryption. You control who sees your private health data."
        />
        <ServiceCard
          icon={<Activity size={32} />}
          title="Proximity Search"
          desc="Find the closest verified doctors to your current location using real-time GPS tracking."
        />
        <ServiceCard
          icon={<Smartphone size={32} />}
          title="Mobile Management"
          desc="Manage your health, edit your medical profile, and track your history all from your mobile phone."
        />
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500">
    <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200">
      {icon}
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-4 leading-tight">
      {title}
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Services;
