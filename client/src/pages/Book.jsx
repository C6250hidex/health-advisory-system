import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Star,
  MapPin,
  Video,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";

const Book = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // State Management
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState("All");
  const [loading, setLoading] = useState(false);

  // Form Data (Includes Profile Fields)
  const [bookingData, setBookingData] = useState({
    doctor_id: null,
    doctor_name: "",
    specialty: "",
    appointment_date: "",
    appointment_time: "",
    consultation_type: "In-Person",
    reason: "",
    phone: "",
    dob: "",
    gender: "",
  });

  // 1. Fetch Doctors (with Proximity) and User Profile on Load
  useEffect(() => {
    // Fetch Doctors (Backend now calculates distance)
    api
      .get("/appointments/doctors")
      .then((res) => {
        setDoctors(res.data);
      })
      .catch((err) => console.error("API Error:", err));

    // Fetch User Profile automatically
    api
      .get("/auth/profile")
      .then((res) => {
        setBookingData((prev) => ({
          ...prev,
          phone: res.data.phone,
          dob: res.data.dob,
          gender: res.data.gender,
        }));
      })
      .catch((err) => console.error("Profile Fetch Error:", err));
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <div className="bg-blue-50 p-10 rounded-[40px] border border-blue-100 max-w-md">
          <Lock className="mx-auto text-blue-600 mb-6" size={48} />
          <h2 className="text-2xl font-black text-gray-900">Login Required</h2>
          <p className="text-gray-500 mt-3">
            You must be logged in to book an appointment and access medical
            records.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleFinalBooking = async () => {
    setLoading(true);
    try {
      await api.post("/appointments/book", {
        doctor_id: bookingData.doctor_id,
        appointment_date: bookingData.appointment_date,
        appointment_time: bookingData.appointment_time,
        reason: bookingData.reason,
      });
      toast.success("Appointment Booked Successfully!");
      navigate("/dashboard");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "An unexpected error occurred.";
      toast.error(`Booking Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* 1. PROGRESS STEPPER */}
      <div className="flex items-center justify-center mb-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > i ? <Check size={20} /> : i}
            </div>
            {i !== 4 && (
              <div
                className={`w-16 md:w-24 h-1 mx-2 rounded ${step > i ? "bg-blue-600" : "bg-gray-200"}`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mb-10">
        <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">
          Appointment Booking
        </p>
        <h1 className="text-4xl font-black text-gray-900 font-serif">
          Book Your Appointment
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Fast, simple, and secure — takes less than 2 minutes.
        </p>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
        {/* STEP 1: CHOOSE DOCTOR */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black text-gray-800 mb-2">
              Choose a Doctor
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Select a specialist for your consultation.
            </p>

            <div className="mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase">
                Specialty
              </label>
              <select
                className="w-full md:w-64 mt-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 appearance-none font-bold text-gray-700"
                onChange={(e) => setSpecialty(e.target.value)}
              >
                <option value="All">All Specialties</option>
                <option value="General Physician">General Physician</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Cardiologist">Cardiologist</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors
                .filter(
                  (d) =>
                    specialty === "All" || d.specialization.includes(specialty),
                )
                .map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() =>
                      setBookingData({
                        ...bookingData,
                        doctor_id: doc.id,
                        doctor_name: doc.name,
                        specialty: doc.specialization,
                      })
                    }
                    className={`p-6 rounded-[28px] border-2 cursor-pointer transition-all flex items-center gap-4 ${
                      bookingData.doctor_id === doc.id
                        ? "border-blue-600 bg-blue-50 shadow-md"
                        : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black shrink-0">
                      {doc.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 leading-tight">
                        {doc.name}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                          {doc.specialization}
                        </p>
                        {/* SHOW DISTANCE - Integrated logic */}
                        <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded-full font-black border border-blue-100">
                          {doc.distance
                            ? `${parseFloat(doc.distance).toFixed(1)} KM AWAY`
                            : "Location Unknown"}
                        </span>
                        <span className="flex items-center text-yellow-500 text-[10px] font-bold">
                          <Star
                            size={10}
                            fill="currentColor"
                            className="mr-1"
                          />{" "}
                          4.9
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT TIME */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black text-gray-800 mb-8 font-serif">
              Select Date & Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} className="text-blue-600" /> Preferred
                  Date
                </label>
                <input
                  type="date"
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      appointment_date: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  {bookingData.consultation_type === "In-Person" ? (
                    <MapPin size={14} className="text-blue-600" />
                  ) : (
                    <Video size={14} className="text-blue-600" />
                  )}
                  Consultation Type
                </label>
                <select
                  className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600"
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      consultation_type: e.target.value,
                    })
                  }
                >
                  <option value="In-Person">In-Person Visit</option>
                  <option value="Virtual">Virtual / Video Call</option>
                </select>
              </div>
            </div>

            <div className="mt-10">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-blue-600" /> Available Slots
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"].map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() =>
                        setBookingData({ ...bookingData, appointment_time: t })
                      }
                      className={`p-3 rounded-xl font-bold text-sm border-2 transition-all ${
                        bookingData.appointment_time === t
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-100 hover:border-blue-200"
                      }`}
                    >
                      {t} AM
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: YOUR DETAILS */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
            <h2 className="text-2xl font-black text-gray-800 mb-2 font-serif">
              Review Medical Profile
            </h2>
            <p className="text-gray-500 mb-4">
              Confirm your details before proceeding.
            </p>

            <div className="bg-blue-50/50 p-8 rounded-[32px] border border-dashed border-blue-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Full Name
                </p>
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Phone Number
                </p>
                <p className="font-bold text-gray-800 text-lg">
                  {bookingData.phone || "Not Set"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Date of Birth
                </p>
                <p className="font-bold text-gray-800 text-lg">
                  {bookingData.dob
                    ? new Date(bookingData.dob).toLocaleDateString()
                    : "Not Set"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Gender
                </p>
                <p className="font-bold text-gray-800 text-lg">
                  {bookingData.gender || "Not Set"}
                </p>
              </div>
              <div className="md:col-span-2 pt-4 border-t border-blue-100 mt-2">
                <Link
                  to="/dashboard"
                  className="text-blue-600 text-sm font-black uppercase tracking-tighter hover:underline"
                >
                  Edit Medical Profile in Dashboard →
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">
                Reason for Visit
              </label>
              <textarea
                placeholder="Briefly describe how you feel or why you are booking this visit..."
                className="w-full p-6 bg-gray-50 border border-gray-100 rounded-[28px] h-40 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                onChange={(e) =>
                  setBookingData({ ...bookingData, reason: e.target.value })
                }
                required
              ></textarea>
            </div>
          </div>
        )}

        {/* STEP 4: CONFIRMATION */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-black text-gray-800 mb-8 font-serif">
              Confirm Appointment
            </h2>
            <div className="bg-gray-50 rounded-[32px] p-8 space-y-4 border border-gray-100 shadow-inner">
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium tracking-tight">
                  Doctor
                </span>
                <span className="font-bold text-gray-900">
                  {bookingData.doctor_name}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium tracking-tight">
                  Date
                </span>
                <span className="font-bold text-gray-900">
                  {bookingData.appointment_date}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span className="text-gray-500 font-medium tracking-tight">
                  Time
                </span>
                <span className="font-bold text-gray-900">
                  {bookingData.appointment_time} AM
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium tracking-tight">
                  Consultation
                </span>
                <span className="font-bold text-blue-600">
                  {bookingData.consultation_type}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="mt-12 flex justify-between">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-gray-500 font-bold px-8 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={20} /> Back
            </button>
          )}

          <div className="ml-auto">
            {step < 4 ? (
              <button
                disabled={
                  (step === 1 && !bookingData.doctor_id) ||
                  (step === 2 && !bookingData.appointment_time)
                }
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all"
              >
                Next Step <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleFinalBooking}
                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl transition-all"
              >
                {loading ? "Processing..." : "Confirm Appointment ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
