import {
  AlertOctagon,
  Calendar,
  FileText,
  Ban,
  CheckCircle2,
} from "lucide-react";

const Terms = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* HERO */}
      <section className="bg-slate-900 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight font-serif text-blue-500">
          Terms of Use
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Please read these terms carefully before using the HealthSync
          platform.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20">
        {/* MEDICAL DISCLAIMER - HIGH IMPORTANCE */}
        <div className="bg-red-50 border-2 border-red-100 rounded-[40px] p-8 mb-16 flex flex-col md:flex-row gap-6 items-center">
          <AlertOctagon className="text-red-500 shrink-0" size={48} />
          <div>
            <h3 className="text-xl font-black text-red-700 mb-2 uppercase tracking-tight">
              Medical Disclaimer
            </h3>
            <p className="text-red-600 text-sm leading-relaxed font-medium">
              HealthSync is NOT for emergencies. Our AI-powered advisory system
              provides general guidance only and is not a final diagnosis. If
              you are experiencing a life-threatening situation, call your local
              emergency services immediately.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <TermItem
            icon={<UserCheck className="text-blue-600" />}
            title="Account Responsibility"
            content="Users are responsible for maintaining the confidentiality of their login credentials. Any activity performed under your account is your legal responsibility."
          />

          <TermItem
            icon={<Calendar className="text-blue-600" />}
            title="Appointments & Cancellations"
            content="Appointments booked through the platform are subject to doctor availability. Doctors reserve the right to reject or reschedule visits based on clinical priority."
          />

          <TermItem
            icon={<FileText className="text-blue-600" />}
            title="Truthful Information"
            content="You agree to provide accurate medical information, including your date of birth and current symptoms. False information may lead to incorrect advice or account suspension."
          />

          <TermItem
            icon={<Ban className="text-blue-600" />}
            title="Prohibited Conduct"
            content="Harassment of medical staff via the chat system, attempting to breach server security, or misusing the symptom checker for spam will result in a permanent ban."
          />
        </div>

        <div className="mt-20 pt-10 border-t border-slate-100 flex items-center gap-4">
          <CheckCircle2 className="text-emerald-500" />
          <p className="text-slate-400 text-sm font-medium italic">
            By clicking "Sign Up" or using our services, you acknowledge that
            you have read and agreed to these terms.
          </p>
        </div>
      </section>
    </div>
  );
};

const TermItem = ({ icon, title, content }) => (
  <div className="flex flex-col md:flex-row gap-6">
    <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold">
      {icon}
    </div>
    <div>
      <h4 className="text-lg font-black text-slate-800 mb-2 uppercase tracking-tighter">
        {title}
      </h4>
      <p className="text-slate-500 text-sm leading-relaxed">{content}</p>
    </div>
  </div>
);

// Sub-component helper
const UserCheck = ({ size = 20, className }) => (
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
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <polyline points="16 11 18 13 22 9" />
  </svg>
);

export default Terms;
