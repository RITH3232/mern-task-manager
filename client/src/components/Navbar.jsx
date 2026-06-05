import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, User, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TaskCluster</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
               <Home size={16} /> Dashboard
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
               <User size={16} /> Profile
            </Link>
          </div>

          {/* User/Logout Section */}
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm uppercase transition-transform group-hover:scale-105">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <span className="text-gray-600 hidden sm:block font-medium hover:text-blue-600 transition-colors">
                {user?.name}
              </span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}