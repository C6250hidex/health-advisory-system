import { useState } from "react";
import api from "../services/api";
import { PlusCircle, MessageSquare, Key } from "lucide-react";
import toast from "react-hot-toast";

const AdminAdvice = () => {
  const [keywords, setKeywords] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sending data to the backend
      await api.post("/advice/add", { keywords, advice_text: advice });
      toast.success("New health advice added successfully!");
      setKeywords("");
      setAdvice("");
    } catch (err) {
      // Using 'err' here to fix the ESLint error
      console.error("Database Error:", err);
      const errorMsg =
        err.response?.data?.message || "Check your backend connection.";
      toast.error(`Failed to add advice: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white  shadow-2xl rounded-[40px] mt-16 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
          <PlusCircle size={28} />
        </div>
        <h2 className="text-3xl font-black text-gray-900">
          Medical Knowledge Base
        </h2>
      </div>

      <p className="text-gray-500 mb-8 font-medium italic">
        "Add new symptoms and advice to expand the AI's diagnostic
        capabilities."
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2">
            <Key size={14} className="text-emerald-500" /> Search Keywords
          </label>
          <input
            placeholder="e.g. malaria, chills, cold"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2">
            <MessageSquare size={14} className="text-emerald-500" /> Medical
            Advice Text
          </label>
          <textarea
            placeholder="What should the patient do if they have these symptoms?"
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl h-40 outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-emerald-600 text-white p-5 rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50"
        >
          {loading ? "Saving to Database..." : "Publish Advice ✓"}
        </button>
      </form>
    </div>
  );
};

export default AdminAdvice;
