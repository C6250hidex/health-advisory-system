import { Link } from "react-router-dom";
import { MoveLeft, Ghost } from "lucide-react";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
    <Ghost size={80} className="text-slate-200 mb-6" />
    <h1 className="text-4xl font-black text-slate-900 mb-2">Page Not Found</h1>
    <p className="text-slate-500 mb-8 max-w-sm">
      Oops! It looks like you've wandered into a restricted area or this page
      doesn't exist.
    </p>
    <Link
      to="/"
      className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2"
    >
      <MoveLeft size={18} /> Back to HealthSync
    </Link>
  </div>
);
export default NotFound;
