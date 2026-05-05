import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Calendar,
  User,
  LogOut,
  LayoutDashboard,
  BookOpen,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl">
            <HeartPulse className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">
            HealthSync
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {/* Public Links (Shown to everyone) */}
          <Link
            to="/"
            className="text-gray-600 font-semibold hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-gray-600 font-semibold hover:text-blue-600 transition"
          >
            About
          </Link>
          <Link
            to="/services"
            className="text-gray-600 font-semibold hover:text-blue-600 transition"
          >
            Services
          </Link>
          <Link
            to="/blog"
            className="text-gray-600 font-semibold hover:text-blue-600 transition"
          >
            Blog
          </Link>

          <div className="h-6 w-[1px] bg-gray-200"></div>

          {/* Conditional Auth Links */}
          {!user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 font-bold hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {/* Authenticated Links */}
              <Link
                to="/advisory"
                className="flex items-center gap-2 text-gray-600 font-semibold hover:text-blue-600 transition"
              >
                <Search size={18} /> Advice
              </Link>
              <Link
                to="/book"
                className="flex items-center gap-2 text-gray-600 font-semibold hover:text-blue-600 transition"
              >
                <Calendar size={18} /> Book Doctor
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition"
              >
                <LayoutDashboard size={18} /> My Portal
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <Link
            onClick={() => setIsOpen(false)}
            to="/"
            className="text-lg font-bold text-gray-800"
          >
            Home
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/about"
            className="text-lg font-bold text-gray-800"
          >
            About
          </Link>
          <Link
            onClick={() => setIsOpen(false)}
            to="/blog"
            className="text-lg font-bold text-gray-800"
          >
            Blog
          </Link>

          <hr className="my-2 border-gray-100" />

          {!user ? (
            <>
              <Link
                onClick={() => setIsOpen(false)}
                to="/login"
                className="text-blue-600 font-bold"
              >
                Login
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                to="/register"
                className="bg-blue-600 text-white p-4 rounded-2xl text-center font-bold"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                onClick={() => setIsOpen(false)}
                to="/advisory"
                className="flex items-center gap-2 text-gray-800 font-bold"
              >
                <Search size={20} /> Advice
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                to="/book"
                className="flex items-center gap-2 text-gray-800 font-bold"
              >
                <Calendar size={20} /> Book Doctor
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                to="/dashboard"
                className="flex items-center gap-2 text-blue-600 font-bold"
              >
                <LayoutDashboard size={20} /> My Portal
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold mt-4"
              >
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
