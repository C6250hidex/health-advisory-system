import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      {status === "loading" && (
        <div className="space-y-4">
          <Loader2 size={60} className="animate-spin text-blue-600 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-700">
            Verifying your account...
          </h2>
        </div>
      )}

      {status === "success" && (
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-emerald-100 animate-in zoom-in duration-500">
          <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Account Activated!
          </h2>
          <p className="text-slate-500 mb-10 max-w-xs mx-auto">
            Your email has been successfully verified. You can now access all
            HealthSync features.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg"
          >
            Login to Dashboard
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-red-100">
          <XCircle size={80} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Verification Failed
          </h2>
          <p className="text-slate-500 mb-10 max-w-xs mx-auto">
            The link is invalid or has already been used.
          </p>
          <Link to="/register" className="text-blue-600 font-bold underline">
            Try registering again
          </Link>
        </div>
      )}
    </div>
  );
};
export default VerifyEmail;
