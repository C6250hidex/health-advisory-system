import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // Imported the new professional Home page
import Login from "./pages/Login";
import Register from "./pages/Register";
import Advisory from "./pages/Advisory";
import Book from "./pages/Book";
import AdminAdvice from "./pages/AdminAdvice";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Services from "./pages/Services";
import { Toaster } from "react-hot-toast";
import Blog from "./pages/Blog";
import Footer from "./components/Footer";
import CreatePost from "./pages/CreatePost";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Chatbot from "./components/Chatbot";

// DashboardGate: Decides which dashboard to show based on User Role and Verification Status
const DashboardGate = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  // 1. VERIFICATION CHECK
  // If user is a doctor but the admin hasn't verified them yet
  if (user.role === "doctor" && user.is_verified === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="bg-orange-100 p-8 rounded-full mb-6 text-4xl animate-pulse">
          ⚠️
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Account Pending
        </h2>
        <p className="text-gray-500 mt-3 max-w-md text-lg">
          Our administrators are currently verifying your medical credentials.
          You will gain access to the doctor panel once approved.
        </p>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
        >
          Logout & Try Later
        </button>
      </div>
    );
  }

  // 2. ROLE-BASED ROUTING
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "doctor") return <DoctorDashboard />;

  // Default is the Patient dashboard
  return <PatientDashboard />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      {/* 
        The pb-24 ensures content doesn't get hidden behind 
        the bottom navigation bar on mobile devices.
      */}
      <div className="min-h-screen bg-gray-50 pt-20 flex flex-col">
        <Navbar />

        <main className="container mx-auto flex-grow">
          <Routes>
            {/* Professional Home Page */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/book" element={<Book />} />
            <Route path="/manage-advice" element={<AdminAdvice />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* This single route handles all 3 dashboard types and verification checks */}
            <Route path="/dashboard" element={<DashboardGate />} />

            {/* Redirect any unknown routes to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Chatbot />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
