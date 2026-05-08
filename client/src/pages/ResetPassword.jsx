import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Lock, Eye, EyeOff, Save } from "lucide-react";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password updated! You can now log in.");
      navigate("/login");
    } catch (err) {
      toast.error("Link expired or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          New Password
        </h2>
        <p className="text-slate-500 mb-8 font-medium">
          Please enter your new secure password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3"
          >
            {loading ? "Updating..." : "Save Password"} <Save size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
