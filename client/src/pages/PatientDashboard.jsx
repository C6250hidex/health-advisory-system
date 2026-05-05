import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Activity,
  User,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Save,
  X,
} from "lucide-react";
import AppointmentChat from "../components/AppointmentChat";
import toast from "react-hot-toast";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState({ phone: "", dob: "", gender: "" });
  const [isEditing, setIsActiveEditing] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all necessary data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appRes, profRes] = await Promise.all([
        api.get("/appointments/my-appointments"),
        api.get("/auth/profile"),
      ]);
      setAppointments(appRes.data);
      setProfile(profRes.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/profile", profile);
      toast.success("Medical Profile Updated Successfully!");
      setIsActiveEditing(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
  };

  // Logic for Quick Stats
  const approvedCount = appointments.filter(
    (a) => a.status === "approved",
  ).length;
  const pendingCount = appointments.filter(
    (a) => a.status === "pending",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* 1. PROFESSIONAL PROFILE SECTION (Edit/View) */}
        <div className="bg-blue-600 rounded-[40px] p-8 text-white mb-10 shadow-2xl shadow-blue-200 relative overflow-hidden transition-all">
          <Activity
            className="absolute -right-10 -bottom-10 opacity-10"
            size={200}
          />

          {isEditing ? (
            <form
              onSubmit={handleProfileUpdate}
              className="relative z-10 animate-in fade-in duration-500"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-widest">
                  Edit Medical Profile
                </h2>
                <button type="button" onClick={() => setIsActiveEditing(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase opacity-70 mb-1">
                    Date of Birth
                  </label>
                  <input
                    className="p-3 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400"
                    type="date"
                    value={profile.dob?.split("T")[0] || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, dob: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase opacity-70 mb-1">
                    Gender
                  </label>
                  <select
                    className="p-3 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400 font-bold"
                    value={profile.gender || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, gender: e.target.value })
                    }
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold uppercase opacity-70 mb-1">
                    Phone Number
                  </label>
                  <input
                    className="p-3 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="+234..."
                    value={profile.phone || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <button className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg transition-all">
                <Save size={18} /> Save Medical Data
              </button>
            </form>
          ) : (
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center border border-white/30">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-blue-100 font-medium mt-1">
                    {profile.phone || "No phone"} •{" "}
                    {profile.gender || "Gender unassigned"} •{" "}
                    {profile.dob
                      ? new Date().getFullYear() -
                        new Date(profile.dob).getFullYear() +
                        " years old"
                      : "DOB not set"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsActiveEditing(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
              >
                Update Profile
              </button>
            </div>
          )}
        </div>

        {/* 2. HEALTH STATS BAR */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm">
            <Activity className="text-blue-600 mb-2" size={20} />
            <p className="text-[10px] font-black text-gray-400 uppercase">
              Total Visits
            </p>
            <p className="text-xl font-black text-gray-800">
              {appointments.length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm">
            <CheckCircle2 className="text-emerald-500 mb-2" size={20} />
            <p className="text-[10px] font-black text-gray-400 uppercase">
              Confirmed
            </p>
            <p className="text-xl font-black text-gray-800">{approvedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm">
            <Clock3 className="text-orange-500 mb-2" size={20} />
            <p className="text-[10px] font-black text-gray-400 uppercase">
              In-Review
            </p>
            <p className="text-xl font-black text-gray-800">{pendingCount}</p>
          </div>
        </div>

        {/* 3. APPOINTMENT LIST */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" size={22} /> Medical Schedule
          </h2>
          <button
            onClick={fetchData}
            className="text-xs font-black text-blue-600 hover:underline uppercase tracking-widest"
          >
            Refresh Sync
          </button>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 text-gray-400 font-bold animate-pulse">
              Syncing encrypted records...
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white p-12 rounded-[40px] text-center border-2 border-dashed border-gray-200">
              <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold mb-6">
                No appointment history found.
              </p>
              <Link
                to="/book"
                className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
              >
                Schedule Consultation
              </Link>
            </div>
          ) : (
            appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white p-6 rounded-[35px] shadow-xl shadow-gray-200/30 border border-gray-100 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl border border-gray-100 shadow-inner">
                      {app.doctor_name.charAt(4)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Dr. {app.doctor_name}
                      </h3>
                      <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">
                        {app.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        app.status === "approved"
                          ? "bg-emerald-100 text-emerald-600"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {app.status}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedChat(selectedChat === app.id ? null : app.id)
                      }
                      className={`flex items-center gap-1.5 text-[10px] font-black uppercase transition-colors ${selectedChat === app.id ? "text-red-500" : "text-gray-400 hover:text-blue-600"}`}
                    >
                      <MessageCircle size={14} />{" "}
                      {selectedChat === app.id ? "Close" : "Chat"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-6 py-4 border-y border-gray-50 mb-4">
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase">
                    <Calendar size={14} className="text-blue-600" />{" "}
                    {new Date(app.appointment_date).toDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase">
                    <Clock size={14} className="text-blue-600" />{" "}
                    {app.appointment_time} AM
                  </div>
                </div>

                {/* CHAT INTEGRATION */}
                {selectedChat === app.id && (
                  <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
                    <AppointmentChat appointmentId={app.id} senderRole="user" />
                  </div>
                )}

                {/* DOCTOR'S INSTRUCTIONS */}
                {app.status === "approved" && app.instructions && (
                  <div className="mb-4 p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest mb-2">
                      <CheckCircle2 size={14} /> Doctor's Instructions
                    </div>
                    <p className="text-emerald-900 text-sm font-medium italic">
                      "{app.instructions}"
                    </p>
                  </div>
                )}

                {/* STATUS SPECIFIC LOGIC */}
                {app.status === "rejected" ? (
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-red-500" size={20} />
                      <p className="text-red-700 text-xs font-bold leading-tight">
                        Visit declined. You can find another doctor below.
                      </p>
                    </div>
                    <Link
                      to="/book"
                      className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-red-200 flex items-center gap-2"
                    >
                      Book New <ChevronRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">
                      Ref: HS-{app.id}00X
                    </p>
                    <button className="text-blue-600 text-[9px] font-black uppercase hover:underline">
                      Download Summary
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 4. HEALTH ADVICE CTA */}
        <Link
          to="/advisory"
          className="mt-12 block bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-[40px] shadow-2xl shadow-blue-200 group overflow-hidden relative"
        >
          <Activity
            className="absolute -right-6 -bottom-6 text-white/10"
            size={120}
          />
          <div className="relative z-10">
            <h4 className="text-white text-xl font-bold mb-2">
              Feeling unwell?
            </h4>
            <p className="text-blue-100 text-sm opacity-80 mb-6">
              Check your symptoms with our AI advisor instantly.
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-2 rounded-xl font-black text-xs uppercase transition group-hover:gap-4">
              Symptom Checker <ChevronRight size={14} />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
