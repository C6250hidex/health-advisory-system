import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
  // 1. Updated initial state to include specialization
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    license: "",
    specialization: "General Physician", // Default value for doctors
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast.success(
        formData.role === "doctor"
          ? "Registration successful! Please wait for Admin approval of your credentials."
          : "Registration successful! You can now login.",
      );
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-blue-600">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Join the HealthSync community today.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-xs font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              formData.role === "user"
                ? "bg-white shadow-md text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setFormData({ ...formData, role: "user" })}
          >
            Patient
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              formData.role === "doctor"
                ? "bg-white shadow-md text-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setFormData({ ...formData, role: "doctor" })}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-blue-200 focus:bg-white transition-all font-medium"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-blue-200 focus:bg-white transition-all font-medium"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* 2. Conditional fields for Doctors: License & Specialization */}
          {formData.role === "doctor" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="relative">
                <ShieldCheck
                  className="absolute left-4 top-4 text-blue-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Medical License Number"
                  className="w-full p-4 pl-12 bg-blue-50/50 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  onChange={(e) =>
                    setFormData({ ...formData, license: e.target.value })
                  }
                  required
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-blue-600 uppercase ml-2 mb-1 block tracking-widest">
                  Medical Specialization
                </label>
                <div className="relative">
                  <select
                    className="w-full p-4 bg-blue-50/50 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none font-bold text-gray-700"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="General Physician">General Physician</option>
                    <option value="Pediatrician">Pediatrician (Kids)</option>
                    <option value="Cardiologist">Cardiologist (Heart)</option>
                    <option value="Dermatologist">Dermatologist (Skin)</option>
                    <option value="Neurologist">Neurologist (Brain)</option>
                    <option value="Psychiatrist">
                      Psychiatrist (Mental Health)
                    </option>
                    <option value="Gynecologist">
                      Gynecologist (Women's Health)
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-4 text-blue-400 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <input
              type="password"
              placeholder="Create Password"
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-transparent focus:border-blue-200 focus:bg-white transition-all font-medium"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : `Sign Up as ${formData.role === "doctor" ? "Doctor" : "Patient"}`}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-6">
          <p className="text-gray-500 text-sm font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
