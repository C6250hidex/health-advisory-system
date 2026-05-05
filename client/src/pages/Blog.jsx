import { useState, useEffect } from "react";
import api from "../services/api";
import {
  Search,
  Clock,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Calendar,
  Share2,
} from "lucide-react";
import Modal from "../components/Modal";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // States for opening the full post
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    "All",
    "Nutrition",
    "Mental Health",
    "Medical Tech",
    "Fitness",
    "Pediatrics",
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleOpenPost = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-slate-900 py-20 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <BookOpen
            className="absolute -right-20 -bottom-20 text-white"
            size={400}
          />
        </div>
        <h1 className="relative z-10 text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
          HealthSync <span className="text-blue-500">Journal.</span>
        </h1>
        <p className="relative z-10 text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          Evidence-based medical insights and healthy living tips from verified
          experts.
        </p>
      </section>

      {/* 2. FILTER BAR */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white p-4 rounded-[35px] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-hide pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeCategory === cat ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BLOG GRID */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-slate-400 animate-pulse uppercase text-xs tracking-widest">
              Loading Journal...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => handleOpenPost(post)}
                className="group cursor-pointer flex flex-col h-full"
              >
                <div className="relative overflow-hidden rounded-[45px] mb-6 bg-blue-50 aspect-[4/3] flex items-center justify-center text-blue-200 transition-transform duration-500 group-hover:scale-[1.02]">
                  <BookOpen size={64} />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="flex-1 px-2">
                  <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase mb-4 tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {post.read_time || "5 min"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />{" "}
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 leading-[1.2] group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                    {post.excerpt || post.content.substring(0, 120) + "..."}
                  </p>
                </div>

                <div className="px-2 flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-black shadow-md">
                      {post.author_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter leading-none mb-1">
                        {post.author_name}
                      </p>
                      {post.author_role === "doctor" && (
                        <span className="flex items-center gap-1 text-[8px] text-emerald-600 font-black uppercase">
                          <CheckCircle2 size={10} /> Verified Expert
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <ArrowUpRight size={20} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* --- FULL ARTICLE MODAL --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPost?.category + " Insights"}
      >
        {selectedPost && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            {/* Header Metadata */}
            <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">
                {selectedPost.category}
              </span>
              <span>•</span>
              <span>{selectedPost.read_time || "5 min"} read</span>
              <span>•</span>
              <span>
                {new Date(selectedPost.created_at).toLocaleDateString()}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8">
              {selectedPost.title}
            </h2>

            {/* Author Card */}
            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[30px] border border-slate-100 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-200">
                  {selectedPost.author_name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                    Written By
                  </p>
                  <h4 className="font-bold text-slate-900 text-lg leading-none">
                    {selectedPost.author_name}
                  </h4>
                </div>
              </div>
              <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-blue-600 transition shadow-sm border border-slate-100">
                <Share2 size={20} />
              </button>
            </div>

            {/* Full Content Body */}
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {selectedPost.content}
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 text-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
              >
                Finished Reading
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Blog;
