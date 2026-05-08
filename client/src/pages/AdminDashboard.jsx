import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  Users,
  Stethoscope,
  Calendar,
  Activity,
  ShieldCheck,
  Trash2,
  CheckCircle,
  XCircle,
  PlusCircle,
  LayoutGrid,
  Search,
  Settings,
  ClipboardList,
  Info,
  PenTool,
} from "lucide-react";
import Modal from "../components/Modal";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    appointments: [],
    doctors: [],
    pendingDoctors: [],
    patients: [],
    logs: [],
  });
  const [myPosts, setMyPosts] = useState([]); // State for blog management
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    data: null,
    type: "",
  });

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetching all required admin data in parallel for performance
      const [userRes, appRes, postsRes] = await Promise.all([
        api.get("/auth/users"),
        api.get("/appointments/admin"),
        api.get("/posts/my-posts"), // Fetching the admin's posts
      ]);

      let logsRes = { data: [] };
      try {
        logsRes = await api.get("/auth/logs");
      } catch (err) {
        console.warn("Logs fetch failed:", err.message);
      }

      setStats({
        appointments: appRes.data,
        doctors: userRes.data.filter((u) => u.role === "doctor"),
        pendingDoctors: userRes.data.filter(
          (u) => u.role === "doctor" && u.is_verified === 0,
        ),
        patients: userRes.data.filter((u) => u.role === "user"),
        logs: logsRes.data,
      });

      setMyPosts(postsRes.data); // Setting the posts state
    } catch (err) {
      console.error("Admin Dashboard Fetch Error:", err.message);
      toast.error("Failed to sync system data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // --- ACTION FUNCTIONS ---

  const handleVerifyDoctor = async (userId) => {
    try {
      await api.put(`/auth/verify-doctor/${userId}`);
      toast.success("Doctor Approved Successfully!");
      fetchAdminData();
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Error verifying doctor");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Permanent Action: Delete this user from the system?")) {
      try {
        await api.delete(`/auth/users/${userId}`);
        toast.success("User removed.");
        fetchAdminData();
      } catch (err) {
        console.error("Delete Error:", err);
        toast.error("Error deleting user");
      }
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Delete this article?")) {
      try {
        await api.delete(`/posts/${id}`);
        setMyPosts(myPosts.filter((p) => p.id !== id));
        toast.success("Article deleted.");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete post");
      }
    }
  };
  const handleEditPost = (post) => {
    // Navigate to create-post page but pass the post data as state
    navigate("/create-post", { state: { editPost: post } });
  };

  // --- MODAL TRIGGER FUNCTIONS ---

  const openProfile = (user) => {
    setModalContent({
      title: "Medical Profile Details",
      type: "profile",
      data: user,
    });
    setIsModalOpen(true);
  };

  const openChatAudit = async (appId) => {
    try {
      const res = await api.get(`/appointments/monitor/${appId}`);
      setModalContent({
        title: "Conversation Audit Trail",
        type: "chat",
        data: res.data,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Audit Error:", err);
      toast.error("Failed to fetch conversation history.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* 1. ADMIN HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              System Admin
            </h1>
            <p className="text-slate-500 font-medium tracking-tight italic">
              Control Center & Performance Audit
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchAdminData}
              className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 text-blue-600 hover:rotate-180 transition-all duration-500"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* 2. REAL-TIME STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div
            onClick={() => setActiveTab("users")}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <AdminStatCard
              title="Total Patients"
              count={stats.patients.length}
              icon={<Users />}
              color="bg-blue-600"
            />
          </div>
          <div
            onClick={() => setActiveTab("users")}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <AdminStatCard
              title="Active Doctors"
              count={stats.doctors.length}
              icon={<Stethoscope />}
              color="bg-emerald-600"
            />
          </div>
          <div
            onClick={() => setActiveTab("appointments")}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <AdminStatCard
              title="Total Bookings"
              count={stats.appointments.length}
              icon={<Calendar />}
              color="bg-indigo-600"
            />
          </div>
          <div
            onClick={() => setActiveTab("verifications")}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <AdminStatCard
              title="Pending Review"
              count={stats.pendingDoctors.length}
              icon={<ShieldCheck />}
              color="bg-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {/* TAB SWITCHER */}
            <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit overflow-x-auto gap-2">
              {["appointments", "verifications", "users", "logs"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-black transition capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}{" "}
                  {tab === "verifications" &&
                    stats.pendingDoctors.length > 0 && (
                      <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                        {stats.pendingDoctors.length}
                      </span>
                    )}
                </button>
              ))}
            </div>

            {/* SEARCH BAR */}
            <div className="relative group">
              <Search
                className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder={`Search in ${activeTab}...`}
                className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-[35px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden min-h-[400px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                  <Activity
                    className="animate-spin text-blue-600 mb-4"
                    size={40}
                  />
                  <p className="text-slate-400 font-bold animate-pulse">
                    Syncing System Data...
                  </p>
                </div>
              ) : (
                <>
                  {activeTab === "appointments" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Patient / Doctor
                            </th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Schedule
                            </th>
                            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.appointments.map((app) => (
                            <tr
                              key={app.id}
                              className="border-b border-slate-50 hover:bg-slate-50/50 transition"
                            >
                              <td className="p-6">
                                <div className="font-bold text-slate-800">
                                  {app.patient_name}
                                </div>
                                <div className="text-xs text-blue-600 font-black tracking-tighter">
                                  Dr. {app.doctor_name}
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="text-sm font-bold text-slate-700">
                                  {new Date(
                                    app.appointment_date,
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {app.appointment_time} AM
                                </div>
                              </td>
                              <td className="p-6">
                                <div className="flex flex-col gap-2">
                                  <span
                                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-center ${
                                      app.status === "approved"
                                        ? "bg-emerald-100 text-emerald-600"
                                        : app.status === "rejected"
                                          ? "bg-red-100 text-red-600"
                                          : "bg-amber-100 text-amber-600"
                                    }`}
                                  >
                                    {app.status}
                                  </span>
                                  <button
                                    onClick={() => openChatAudit(app.id)}
                                    className="text-[9px] font-black text-blue-600 uppercase hover:underline flex items-center gap-1 justify-center"
                                  >
                                    <Info size={10} /> Audit Conversation
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "verifications" && (
                    <div className="p-8 space-y-6">
                      {stats.pendingDoctors.length === 0 ? (
                        <div className="text-center py-10">
                          <ShieldCheck
                            size={48}
                            className="mx-auto text-slate-200 mb-4"
                          />
                          <p className="text-slate-400 font-bold">
                            All doctors verified.
                          </p>
                        </div>
                      ) : (
                        stats.pendingDoctors.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-white p-3 rounded-2xl text-blue-600">
                                <Stethoscope size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800">
                                  {doc.name}
                                </h4>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                                  Pending Review
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVerifyDoctor(doc.id)}
                                className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 shadow-lg"
                              >
                                <CheckCircle size={20} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(doc.id)}
                                className="bg-white text-red-500 p-3 rounded-xl border border-red-100 hover:bg-red-50"
                              >
                                <XCircle size={20} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "users" && (
                    <div className="p-8 grid gap-4">
                      {[...stats.patients, ...stats.doctors].map((u) => (
                        <div
                          key={u.id}
                          className="bg-slate-50 p-5 rounded-3xl flex justify-between items-center border border-slate-100 hover:border-blue-200 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${u.role === "doctor" ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}
                            >
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">
                                {u.name}{" "}
                                <span className="text-[9px] uppercase bg-slate-200 px-2 py-0.5 rounded-full ml-2 font-black">
                                  {u.role}
                                </span>
                              </h4>
                              <p className="text-xs text-slate-500">
                                {u.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openProfile(u)}
                              className="bg-white text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-200 hover:bg-slate-100 flex items-center gap-2"
                            >
                              <Info size={14} /> Profile
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="text-red-400 hover:text-red-600 p-2 rounded-xl transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "logs" && (
                    <div className="p-8 space-y-4">
                      {stats.logs.map((log) => (
                        <div
                          key={log.id}
                          className="bg-slate-50 p-4 rounded-2xl border-l-4 border-blue-500 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {log.action_type}
                            </p>
                            <p className="text-xs text-slate-500">
                              {log.details} by Admin
                            </p>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* --- NEW SECTION: BLOG MANAGEMENT (integrated below appointment list) --- */}
            <div className="mt-12 bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black flex items-center gap-2 text-slate-800">
                  <PenTool size={20} className="text-blue-600" /> Published
                  Articles
                </h3>
                <Link
                  to="/create-post"
                  className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  New Post +
                </Link>
              </div>
              <div className="grid gap-4">
                {myPosts.length === 0 ? (
                  <p className="text-center py-6 text-slate-400 italic text-sm">
                    You haven't published any articles yet.
                  </p>
                ) : (
                  myPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-blue-100 transition-all"
                    >
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-[9px] text-blue-600 font-black uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md">
                            {post.category}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            toast(
                              "Feature coming soon: Use the Blog page to view full content.",
                            )
                          }
                          className="p-2.5 bg-white text-slate-400 hover:text-blue-600 rounded-xl border border-slate-100 shadow-sm"
                        >
                          <Settings size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2.5 bg-white text-slate-400 hover:text-red-600 rounded-xl border border-slate-100 shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleEditPost(post.id)}
                          className="p-2.5 bg-white text-slate-400 hover:text-green-600 rounded-xl border border-slate-100 shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[35px] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <LayoutGrid size={20} className="text-blue-600" /> Control Panel
              </h3>
              <div className="grid gap-4">
                <Link
                  to="/manage-advice"
                  className="group p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between hover:bg-emerald-600 transition-all"
                >
                  <div>
                    <h4 className="font-bold text-emerald-900 group-hover:text-white">
                      Health Database
                    </h4>
                    <p className="text-xs text-emerald-600 group-hover:text-emerald-100">
                      Add symptoms & advice
                    </p>
                  </div>
                  <PlusCircle className="text-emerald-600 group-hover:text-white" />
                </Link>
                <Link
                  to="/create-post"
                  className="group p-5 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center justify-between hover:bg-indigo-600 transition-all"
                >
                  <div>
                    <h4 className="font-bold text-indigo-900 group-hover:text-white">
                      Health Journal
                    </h4>
                    <p className="text-xs text-indigo-600 group-hover:text-indigo-100">
                      Publish news
                    </p>
                  </div>
                  <PenTool className="text-indigo-600 group-hover:text-white" />
                </Link>
                <div
                  onClick={() => setActiveTab("logs")}
                  className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-600 group transition-all"
                >
                  <div>
                    <h4 className="font-bold text-blue-900 group-hover:text-white">
                      System Logs
                    </h4>
                    <p className="text-xs text-blue-600 group-hover:text-blue-100">
                      Audit trail
                    </p>
                  </div>
                  <Activity className="text-blue-600 group-hover:text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[35px] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden">
              <ClipboardList
                className="absolute -right-10 -bottom-10 opacity-20"
                size={150}
              />
              <h4 className="text-lg font-bold mb-2">Infrastructure</h4>
              <p className="text-indigo-100 text-xs mb-6">
                Live server metrics.
              </p>
              <div className="space-y-4">
                <LiveBar label="DB Latency" percent="99.9%" />
                <LiveBar label="API Load" percent="12ms" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
      >
        {modalContent.type === "profile" && modalContent.data && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black">
                {modalContent.data.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900 leading-tight">
                  {modalContent.data.name}
                </h4>
                <p className="text-xs text-blue-600 font-black uppercase tracking-widest">
                  {modalContent.data.role}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ProfileDataBox
                label="Email Address"
                value={modalContent.data.email}
              />
              <ProfileDataBox
                label="Phone Number"
                value={modalContent.data.phone || "Not set"}
              />
              <ProfileDataBox
                label="Gender"
                value={modalContent.data.gender || "Not set"}
              />
              <ProfileDataBox
                label="Date of Birth"
                value={
                  modalContent.data.dob
                    ? new Date(modalContent.data.dob).toLocaleDateString()
                    : "Not set"
                }
              />
            </div>
          </div>
        )}

        {modalContent.type === "chat" && (
          <div className="space-y-4">
            {modalContent.data.length === 0 ? (
              <p className="text-center py-10 text-gray-400 font-bold uppercase text-xs">
                No activity yet.
              </p>
            ) : (
              modalContent.data.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border ${m.sender_role === "doctor" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"}`}
                >
                  <p className="text-[9px] font-black uppercase mb-1 text-slate-400 flex justify-between">
                    <span>
                      {m.sender_name} ({m.sender_role})
                    </span>
                    <span>
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {m.message_text}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// Sub-components
const AdminStatCard = ({ title, count, icon, color }) => (
  <div className="bg-white p-6 rounded-[30px] shadow-sm border border-slate-100 flex items-center gap-5">
    <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
        {title}
      </p>
      <h4 className="text-2xl font-black text-slate-900">{count}</h4>
    </div>
  </div>
);

const ProfileDataBox = ({ label, value }) => (
  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="font-bold text-slate-800 truncate">{value}</p>
  </div>
);

const LiveBar = ({ label, percent }) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
      <span>{label}</span>
      <span>{percent}</span>
    </div>
    <div className="h-1.5 bg-indigo-900/30 rounded-full overflow-hidden">
      <div className="h-full bg-white w-full animate-pulse"></div>
    </div>
  </div>
);

export default AdminDashboard;
