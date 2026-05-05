import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  PlusCircle,
  Activity,
  Users,
  ClipboardList,
  Power,
  Info,
  MessageCircle,
  Mail,
  Phone,
  Baby,
  PenTool,
  Settings,
  Save,
  MapPin,
  Briefcase,
} from "lucide-react";
import AppointmentChat from "../components/AppointmentChat";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

// Helper for GPS Location
const getRealTimeLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { timeout: 5000 },
      );
    }
  });
};

const DoctorDashboard = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  // MODAL STATES
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const [selectedApp, setSelectedApp] = useState(null);
  const [instructions, setInstructions] = useState("");

  // 1. Updated Initial State to include experience_years
  const [doctorData, setDoctorData] = useState({
    phone: "",
    dob: "",
    gender: "",
    bio: "",
    clinic_address: "",
    experience_years: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // 2. Integrated fetchDashboardData (High Performance Sync)
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [appRes, profRes] = await Promise.all([
        api.get("/appointments/doctor"),
        api.get("/auth/profile"),
      ]);

      setApps(appRes.data);
      setDoctorData({
        phone: profRes.data.phone || "",
        dob: profRes.data.dob || "",
        gender: profRes.data.gender || "",
        bio: profRes.data.bio || "",
        clinic_address: profRes.data.clinic_address || "",
        experience_years: profRes.data.experience_years || "",
      });
    } catch (err) {
      console.error("Dashboard Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateDoctorProfile = async (e) => {
    e.preventDefault();
    setStatusLoading(true);

    let coordinates = { lat: null, lng: null };

    try {
      try {
        const loc = await getRealTimeLocation();
        coordinates = loc;
      } catch (locErr) {
        console.warn(
          "Location skipped. Saving profile without GPS.",
          locErr.message,
        );
      }

      // Send all data including experience_years
      await api.put("/auth/profile", {
        ...doctorData,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      });

      toast.success("Professional Profile Updated Successfully!");
      setIsSettingsModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.error("Profile Update Error:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleApproveClick = (app) => {
    setSelectedApp(app);
    setIsInstructionModalOpen(true);
  };

  const handleViewProfile = (app) => {
    setSelectedApp(app);
    setIsProfileModalOpen(true);
  };

  const submitApproval = async () => {
    try {
      await api.put(`/appointments/${selectedApp.id}/status`, {
        status: "approved",
        instructions,
      });
      setIsInstructionModalOpen(false);
      setInstructions("");
      fetchDashboardData();
    } catch (err) {
      console.error("Approval Error:", err);
      toast.error("Failed to approve appointment.");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Reject this appointment?")) {
      try {
        await api.put(`/appointments/${id}/status`, { status: "rejected" });
        fetchDashboardData();
      } catch (err) {
        console.error(err);
        toast.error("Failed to update status");
      }
    }
  };

  const toggleStatus = async () => {
    setStatusLoading(true);
    const newStatus = !isActive;
    try {
      await api.patch("/appointments/status-toggle", { is_active: newStatus });
      setIsActive(newStatus);
    } catch (err) {
      console.error("Toggle Status Error:", err.message);
      toast.error("Could not update availability.");
    } finally {
      setStatusLoading(false);
    }
  };

  const pendingCount = apps.filter((a) => a.status === "pending").length;
  const approvedCount = apps.filter((a) => a.status === "approved").length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* 1. DOCTOR HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all cursor-pointer group relative"
            >
              <User size={32} />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full"></div>
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                Doctor's Portal
              </h1>
              <p className="text-gray-500 font-medium italic mt-2">
                Active Practitioner: {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="bg-white p-3 rounded-2xl border border-gray-200 text-gray-500 hover:text-blue-600 transition shadow-sm"
            >
              <Settings size={22} />
            </button>

            <div
              className={`flex items-center gap-4 p-2 pl-4 pr-3 rounded-2xl border transition-all shadow-sm bg-white ${isActive ? "border-emerald-100" : "border-red-100"}`}
            >
              <div className="flex flex-col">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                  Clinic Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
                  ></span>
                  <span
                    className={`font-bold text-sm ${isActive ? "text-emerald-700" : "text-red-700"}`}
                  >
                    {isActive ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <button
                disabled={statusLoading}
                onClick={toggleStatus}
                className={`p-3 rounded-xl transition-all ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
              >
                <Power size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            title="Total Consultations"
            count={apps.length}
            icon={<ClipboardList />}
            color="bg-blue-600"
          />
          <StatCard
            title="Awaiting Review"
            count={pendingCount}
            icon={<Clock />}
            color="bg-orange-500"
          />
          <StatCard
            title="Active Patients"
            count={approvedCount}
            icon={<Users />}
            color="bg-emerald-600"
          />
        </div>

        {/* 3. APPOINTMENT MANAGEMENT */}
        <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h2 className="text-xl font-black text-gray-800 tracking-tight">
              Appointment Queue
            </h2>
            <button
              onClick={fetchDashboardData}
              className="text-xs font-black text-blue-600 uppercase"
            >
              Refresh Sync
            </button>
          </div>

          <div className="p-4 md:p-8 space-y-4">
            {loading ? (
              <div className="text-center py-20 text-gray-400 font-bold animate-pulse">
                Syncing Encrypted Records...
              </div>
            ) : apps.length === 0 ? (
              <div className="text-center py-20 text-gray-300 font-bold uppercase text-xs">
                No active consultations
              </div>
            ) : (
              apps.map((app) => (
                <div
                  key={app.id}
                  className="group bg-white hover:shadow-md transition-all p-6 rounded-[32px] border border-gray-100 flex flex-col gap-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5 w-full md:w-auto">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-inner">
                        {app.patient_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                            Age: {calculateAge(app.dob)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {app.patient_name}
                        </h3>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />{" "}
                            {new Date(
                              app.appointment_date,
                            ).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} /> {app.appointment_time} AM
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleViewProfile(app)}
                        className="bg-blue-50 text-blue-600 p-3 rounded-xl shadow-sm flex items-center gap-2 text-xs font-black uppercase"
                      >
                        <Info size={18} /> File
                      </button>
                      <button
                        onClick={() =>
                          setSelectedChat(
                            selectedChat === app.id ? null : app.id,
                          )
                        }
                        className={`p-3 rounded-xl shadow-sm flex items-center gap-2 text-xs font-bold ${selectedChat === app.id ? "bg-red-50 text-red-600" : "bg-indigo-50 text-indigo-600"}`}
                      >
                        <MessageCircle size={18} />{" "}
                        {selectedChat === app.id ? "Close" : "Chat"}
                      </button>

                      {app.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveClick(app)}
                            className="bg-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-emerald-100"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="bg-white text-red-500 border border-red-100 p-3 rounded-xl"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${app.status === "approved" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
                        >
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedChat === app.id && (
                    <div className="w-full mt-4 animate-in slide-in-from-top-4 duration-300">
                      <AppointmentChat
                        appointmentId={app.id}
                        senderRole="doctor"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 4. TOOLS */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 p-10 rounded-[40px] shadow-2xl shadow-blue-200 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          <Activity
            className="absolute -right-10 -bottom-10 text-white/10"
            size={200}
          />
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-2xl font-black text-white">
              Medical Knowledge Base
            </h3>
            <p className="text-blue-100 mt-2 max-w-sm">
              Contribute symptoms and guidance to improve the diagnostic AI.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
            <Link
              to="/manage-advice"
              className="bg-white text-emerald-600 px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} /> Add Advice
            </Link>
            <Link
              to="/create-post"
              className="bg-emerald-100/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <PenTool size={18} /> Post Blog
            </Link>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="My Professional Identity"
      >
        <form
          onSubmit={updateDoctorProfile}
          className="space-y-6 animate-in fade-in zoom-in-95 duration-300"
        >
          {/* Visual ID Card Preview */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden">
            <Activity
              className="absolute -right-6 -bottom-6 opacity-10"
              size={140}
            />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                <User size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black leading-tight">
                  {user?.name}
                </h4>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">
                  {user?.specialization || "Specialist"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-between border-t border-white/10 pt-4 relative z-10 text-[10px] uppercase font-bold opacity-60">
              <span>Experience: {doctorData.experience_years || 0} Years</span>
              <span>ID: DOC-{user?.id}882</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                Phone Line
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-4 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  value={doctorData.phone}
                  onChange={(e) =>
                    setDoctorData({ ...doctorData, phone: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                Years of Experience
              </label>
              <div className="relative">
                <Briefcase
                  className="absolute left-4 top-4 text-slate-300"
                  size={18}
                />
                <input
                  type="number"
                  className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                  placeholder="Years"
                  value={doctorData.experience_years}
                  onChange={(e) =>
                    setDoctorData({
                      ...doctorData,
                      experience_years: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
              Clinic Address
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-slate-300"
                size={18}
              />
              <input
                type="text"
                className="w-full pl-12 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                value={doctorData.clinic_address}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    clinic_address: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
              Biography
            </label>
            <textarea
              className="w-full p-5 bg-gray-50 border border-slate-100 rounded-[28px] h-32 outline-none focus:ring-2 focus:ring-blue-600 font-medium"
              placeholder="Describe your expertise..."
              value={doctorData.bio}
              onChange={(e) =>
                setDoctorData({ ...doctorData, bio: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={statusLoading}
            className="w-full bg-blue-600 text-white p-5 rounded-[22px] font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save size={22} />{" "}
            {statusLoading ? "Syncing..." : "Update My Profile"}
          </button>
        </form>
      </Modal>

      {/* Patient File Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Patient Medical File"
      >
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex items-center gap-5 bg-blue-50 p-6 rounded-[32px] border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                {selectedApp.patient_name.charAt(0)}
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900 leading-none">
                  {selectedApp.patient_name}
                </h4>
                <p className="text-xs text-blue-600 font-black uppercase tracking-widest mt-1">
                  ID: #PAT-{selectedApp.user_id}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ProfileDataBox
                icon={<Mail size={14} />}
                label="Email"
                value={selectedApp.email}
              />
              <ProfileDataBox
                icon={<Phone size={14} />}
                label="Phone"
                value={selectedApp.phone || "N/A"}
              />
              <ProfileDataBox
                icon={<Baby size={14} />}
                label="DOB"
                value={
                  selectedApp.dob
                    ? new Date(selectedApp.dob).toLocaleDateString()
                    : "N/A"
                }
              />
              <ProfileDataBox
                icon={<Activity size={14} />}
                label="Gender"
                value={selectedApp.gender || "N/A"}
              />
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border italic font-medium text-slate-700">
              <p className="text-[10px] not-italic font-black text-gray-400 uppercase mb-2">
                Reason for Visit
              </p>
              "{selectedApp.reason || "No details provided."}"
            </div>
          </div>
        )}
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={isInstructionModalOpen}
        onClose={() => setIsInstructionModalOpen(false)}
        title="Approve Appointment"
      >
        <div className="space-y-6">
          <textarea
            className="w-full p-5 bg-gray-50 border border-gray-200 rounded-[28px] h-40 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            placeholder="Instructions..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          <button
            onClick={submitApproval}
            disabled={!instructions.trim()}
            className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black text-lg shadow-xl"
          >
            Confirm Approval ✓
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
        {title}
      </p>
      <h4 className="text-4xl font-black text-gray-900">{count}</h4>
    </div>
    <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
      {icon}
    </div>
  </div>
);

const ProfileDataBox = ({ icon, label, value }) => (
  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="font-bold text-slate-800 text-sm truncate">{value}</p>
  </div>
);

export default DoctorDashboard;
