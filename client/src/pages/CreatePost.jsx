import { useState } from "react";
import api from "../services/api";
import { PenTool, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const CreatePost = () => {
  const location = useLocation();
  const editData = location.state?.editPost;
  const [post, setPost] = useState(
    editData || {
      title: "",
      content: "",
      excerpt: "",
      category: "Nutrition",
      read_time: "5 min",
    },
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await api.put(`/posts/${editData.id}`, post);
        toast.success("Post updated successfully!");
      } else {
        await api.post("/posts", post);
        toast.success("Published successfully!");
      }
      window.location.href = "/blog";
    } catch (err) {
      toast.error(err.response?.data?.message || "Error publishing");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
        <PenTool className="text-blue-600" /> Write a Health Tip
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-100 space-y-6"
      >
        <input
          className="w-full text-2xl font-bold border-none outline-none placeholder:text-gray-300"
          placeholder="Article Title..."
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />
        <div className="flex gap-4">
          <select
            className="bg-gray-50 p-3 rounded-xl text-xs font-bold uppercase"
            onChange={(e) => setPost({ ...post, category: e.target.value })}
          >
            <option>Nutrition</option>
            <option>Mental Health</option>
            <option>Fitness</option>
            <option>Medical Tech</option>
            <option>Pediatrics</option>
          </select>
          <input
            className="bg-gray-50 p-3 rounded-xl text-xs font-bold w-32"
            placeholder="Read Time (e.g. 5 min)"
            onChange={(e) => setPost({ ...post, read_time: e.target.value })}
          />
        </div>
        <textarea
          className="w-full p-4 bg-gray-50 rounded-3xl h-64 outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Write your medical advice here..."
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          required
        />
        <button className="w-full bg-blue-600 text-white p-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-200">
          <Send size={20} /> Publish to Blog
        </button>
      </form>
    </div>
  );
};
export default CreatePost;
