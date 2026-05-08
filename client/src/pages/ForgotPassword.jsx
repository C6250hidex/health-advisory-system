import { useState } from "react";
import api from "../services/api";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent! Check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-6 transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Login
        </Link>
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Forgot Password?
        </h2>
        <p className="text-slate-500 mb-8 font-medium">
          Enter your email and we'll send you a recovery link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100 flex items-center justify-center gap-3 hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Sending..." : "Send Reset Link"} <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
