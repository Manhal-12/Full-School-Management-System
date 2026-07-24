import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 shadow-xl sticky top-0 z-50 border-b border-amber-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-tight block">
                SchoolMS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-amber-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  to="/students"
                  className="text-gray-300 hover:text-amber-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Students
                </Link>
                <Link
                  to="/teachers"
                  className="text-gray-300 hover:text-amber-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Teachers
                </Link>
                <Link
                  to="/courses"
                  className="text-gray-300 hover:text-amber-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Courses
                </Link>
                <Link
                  to="/classes"
                  className="text-gray-300 hover:text-amber-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Classes
                </Link>
                <Link
                  to="/enrollments"
                  className="text-gray-300 hover:text-amber-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Enrollments
                </Link>

                {/* Admin-only: User Management */}
                {isAdmin && (
                  <Link
                    to="/users"
                    className="text-gray-300 hover:text-amber-400 hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    Users
                  </Link>
                )}

                <div className="ml-4 flex items-center space-x-3 border-l border-white/20 pl-4">
                  <div className="text-right">
                    <span className="text-white text-sm font-medium block leading-tight">
                      {user?.fullName}
                    </span>
                    <span className="text-amber-400 text-xs block leading-tight">
                      {user?.role?.replace("ROLE_", "")}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all border border-red-500/30"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button className="text-gray-300 p-2 hover:bg-white/10 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
