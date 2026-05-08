import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { PenTool, Send, Layout, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const CreatePost = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state?.editPost; // Check if we were sent a post to edit

  // State for the post data
  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "Nutrition",
    read_time: "5 min",
  });

  const [loading, setLoading] = useState(false);

  // 1. Pre-fill form if we are in Edit Mode
  useEffect(() => {
    if (editData) {
      setPost({
        title: editData.title || "",
        content: editData.content || "",
        excerpt: editData.excerpt || "",
        category: editData.category || "Nutrition",
        read_time: editData.read_time || "5 min",
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editData) {
        // --- EDIT MODE ---
        await api.put(`/posts/${editData.id}`, post);
        toast.success("Article updated successfully!");
      } else {
        // --- CREATE MODE ---
        await api.post("/posts", post);
        toast.success("Health tip published and users notified!");
      }
      // Redirect back to blog after success
      navigate("/blog");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Operation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 pb-24">
      {/* PROFESSIONAL NAVIGATION */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-blue-600 transition-colors group"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 group-hover:bg-blue-50">
          <ArrowLeft size={18} />
        </div>
        <span className="text-xs uppercase tracking-widest">Go Back</span>
      </button>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
            <PenTool size={24} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {editData ? "Edit Health Tip" : "Publish Health Tip"}
          </h1>
        </div>
        <p className="text-slate-500 font-medium italic ml-12">
          {editData
            ? "Update existing medical guidance for your patients."
            : "Share your medical expertise with the community."}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-12 rounded-[45px] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        {/* TITLE INPUT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">
            Article Title
          </label>
          <input
            className="w-full p-6 bg-slate-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-3xl text-2xl font-black text-slate-800 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. 5 Ways to Manage High Blood Pressure"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
          />
        </div>

        {/* METADATA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">
              Category
            </label>
            <div className="relative">
              <select
                className="w-full p-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-slate-700 appearance-none px-6"
                value={post.category}
                onChange={(e) => setPost({ ...post, category: e.target.value })}
              >
                <option>Nutrition</option>
                <option>Mental Health</option>
                <option>Fitness</option>
                <option>Medical Tech</option>
                <option>Pediatrics</option>
              </select>
              <Layout
                size={18}
                className="absolute right-5 top-4 text-slate-300 pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">
              Read Time
            </label>
            <div className="relative">
              <Clock
                size={18}
                className="absolute left-5 top-4 text-slate-300"
              />
              <input
                className="w-full pl-12 p-4 bg-slate-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                placeholder="e.g. 5 min"
                value={post.read_time}
                onChange={(e) =>
                  setPost({ ...post, read_time: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* CONTENT TEXTAREA */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 block">
            Main Content
          </label>
          <textarea
            className="w-full p-8 bg-slate-50 border border-transparent focus:border-blue-200 focus:bg-white rounded-[40px] h-96 outline-none transition-all font-medium text-slate-700 leading-relaxed text-lg"
            placeholder="Write your medical advice here... Use clear paragraphs."
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-slate-900 text-white p-6 rounded-[30px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <>
              <Send size={22} />{" "}
              {editData ? "Update Health Article ✓" : "Publish to Journal ✓"}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
