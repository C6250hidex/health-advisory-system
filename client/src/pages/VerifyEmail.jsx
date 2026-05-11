import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      {status === "loading" && (
        <div className="animate-pulse">
          <Loader2
            size={60}
            className="animate-spin text-blue-600 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-slate-600">
            Verifying your email...
          </h2>
        </div>
      )}

      {status === "success" && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-emerald-100 max-w-sm">
          <CheckCircle size={80} className="text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900">
            Email Verified!
          </h2>
          <p className="text-slate-500 mt-4 mb-8">
            Your account is now active. You can log in to book appointments.
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold"
          >
            Go to Login
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-red-100 max-w-sm">
          <XCircle size={80} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black text-slate-900">Link Invalid</h2>
          <p className="text-slate-500 mt-4 mb-8">
            The link may have expired or was already used.
          </p>
          <Link to="/register" className="text-blue-600 font-bold underline">
            Try Registering Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
