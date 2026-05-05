import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Globe,
  UserCheck,
} from "lucide-react";

const Privacy = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HERO */}
      <section className="bg-slate-50 py-20 px-6 text-center border-b border-slate-100">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          <ShieldCheck size={14} /> Data Protection Guaranteed
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight font-serif">
          Privacy Policy
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Your health data is private. Learn how we use industry-leading
          encryption to keep your records secure.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 space-y-16">
        <PrivacySection
          icon={<Database className="text-blue-600" />}
          title="1. Information We Collect"
          content="We collect personal data (Name, Email, Phone), medical profiles (DOB, Gender, Symptoms), and real-time location data (GPS) to connect you with the nearest healthcare providers."
        />

        <PrivacySection
          icon={<Lock className="text-blue-600" />}
          title="2. How We Protect Your Data"
          content="All medical records and chat histories are stored in encrypted databases. We use JSON Web Tokens (JWT) for secure authentication and Bcrypt hashing for password protection."
        />

        <PrivacySection
          icon={<EyeOff className="text-blue-600" />}
          title="3. Data Sharing & Visibility"
          content="Your medical file is only visible to the doctor you book an appointment with and the system administrator. We never sell your data to third-party pharmaceutical or insurance companies."
        />

        <PrivacySection
          icon={<Globe className="text-blue-600" />}
          title="4. Real-Time Location"
          content="Your GPS coordinates are used solely to calculate proximity to medical clinics. This data is updated only when you click 'Update Location' and is not tracked in the background."
        />

        <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-200">
          <h3 className="text-2xl font-black mb-4 flex items-center gap-2">
            <UserCheck /> Your Rights
          </h3>
          <p className="text-blue-100 leading-relaxed mb-6">
            You have the right to access, edit, or request the deletion of your
            medical profile at any time through your dashboard or by contacting
            the system administrator.
          </p>
          <p className="text-xs font-bold uppercase tracking-widest opacity-60">
            Last Updated: May 2024
          </p>
        </div>
      </section>
    </div>
  );
};

const PrivacySection = ({ icon, title, content }) => (
  <div className="flex gap-6">
    <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-black text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{content}</p>
    </div>
  </div>
);

export default Privacy;
