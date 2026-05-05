import { Link } from "react-router-dom";
import { HeartPulse, Mail, Phone, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-950 py-20 px-6 text-center text-gray-500 border-t border-gray-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ">
        {/* 1. BRAND SECTION */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <HeartPulse className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter italic">
              HealthSync
            </span>
          </Link>
          <p className="leading-relaxed text-sm max-w-xs">
            Making healthcare accessible to everyone through simple,
            mobile-friendly technology. Your digital gateway to better health.
          </p>
        </div>

        <div>
          <h5 className="text-white font-bold mb-6">Quick Links</h5>
          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/advisory" className="hover:text-white transition">
                Symptom Checker
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-white transition">
                Book a Doctor
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white transition">
                Patient Portal
              </Link>
            </li>
          </ul>
        </div>
        {/* 3. COMPANY SECTION */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">
            Company
          </h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link to="/about" className="hover:text-blue-500 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-blue-500 transition">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-blue-500 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-blue-500 transition">
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-bold mb-6">Contact</h5>
          <ul className="space-y-4 text-sm">
            <li>support@healthsync.com</li>
            <li>+1 (555) 000-HEALTH</li>
            <li>Abia, Nigeria</li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-gray-900 text-xs tracking-widest uppercase">
        © 2024 HealthSync System • Built by Chidex Global
      </div>
    </footer>
  );
};

export default Footer;
