import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Bell,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logonav.svg";

// 🎨 Helper: Generate consistent color per username
const getRandomColor = (name) => {
  if (!name) return "#6366f1"; // default indigo
  const colors = [
    "#6366f1",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const hexToRgba = (hex, alpha = 0.5) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Navbar({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [animateBell, setAnimateBell] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Home", href: "/events" },
    { name: "My Events", href: "/saved" },
    { name: "TechPulse", href: "/techpulse" },
  ];

  const avatarColor = user ? getRandomColor(user.name) : "#6366f1";

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      const lower = latest.toLowerCase();

      let icon = "💡";
      let bgColor = "#6366f1";

      if (lower.includes("event")) {
        icon = "🎟️";
        bgColor = "#22c55e";
      } else if (lower.includes("reminder") || lower.includes("today")) {
        icon = "⏰";
        bgColor = "#f59e0b";
      } else if (lower.includes("error") || lower.includes("failed")) {
        icon = "❌";
        bgColor = "#ef4444";
      } else if (lower.includes("welcome")) {
        icon = "👋";
        bgColor = "#3b82f6";
      }

      const username = user?.name?.split(" ")[0] || "there";

      toast(
        () => (
          <div className="flex items-center gap-3 text-white">
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold shadow-md"
              style={{ backgroundColor: bgColor }}
            >
              {icon}
            </div>
            <div>
              <p className="font-semibold text-sm">
                Hey {username}! {latest}
              </p>
              <p className="text-xs text-gray-300 mt-1">Tap to view details</p>
            </div>
          </div>
        ),
        {
          duration: 4500,
          position: "top-right",
          style: {
            background: "linear-gradient(to right, #1e293b, #0f172a)",
            border: "1px solid #4f46e5",
            padding: "10px 14px",
            borderRadius: "12px",
          },
        }
      );

      setAnimateBell(true);
      const timer = setTimeout(() => setAnimateBell(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [notifications, user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!", {
      duration: 2000,
      position: "top-right",
    });
    setDropdownOpen(false);
    setTimeout(() => {
      window.location.href = "/events";
    }, 500);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b border-white/10 shadow-xl"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 to-[#1e293b]/80" />
      <Toaster />

      <div className="relative mx-auto flex items-center justify-between pr-6 pl-3 py-3 w-full">

        {/* ⭐ Bigger Logo + aligned left */}
        <Link to="/events" className="flex items-center gap-3 group">
          <motion.img
            src={logo}
            alt="Evenity Logo"
            className="w-18 h-12 drop-shadow-xl group-hover:rotate-6 transition-transform duration-300"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 font-medium ml-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-indigo-500 hover:after:w-full after:transition-all"
              >
                {item.name}
              </Link>
            </li>
          ))}

          {/* Create Event */}
          <li>
            <Link
              to="/create-event"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-full font-semibold text-sm text-white shadow-md hover:shadow-indigo-700/50 hover:scale-105 transition-transform duration-300 relative overflow-hidden group"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-400 blur-xl opacity-30 animate-pulse"
              />
              <PlusCircle size={18} className="text-white" />
              <span className="relative z-10">Create Event</span>
            </Link>
          </li>

          {/* Notifications */}
          <li className="relative group">
            <motion.button
              animate={animateBell ? { rotate: [0, -12, 12, -6, 6, 0] } : {}}
              transition={{ duration: 0.8 }}
              className="relative p-2 hover:bg-white/10 rounded-full transition shadow-sm"
            >
              <motion.div
                animate={
                  notifications.length > 0
                    ? { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md"
              ></motion.div>

              <Bell size={22} className="relative z-10" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notifications.length}
                </span>
              )}
            </motion.button>
          </li>

          {/* User Section */}
          <li className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative flex items-center gap-3 px-3 py-2 rounded-full bg-gradient-to-br from-indigo-500/70 to-blue-600/60 shadow-lg hover:shadow-indigo-600/40 transition-all backdrop-blur-md"
                >
                  <motion.span
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -inset-1 rounded-full blur-lg"
                    style={{
                      background: hexToRgba(avatarColor, 0.4),
                    }}
                  ></motion.span>

                  <div
                    className="relative w-8 h-8 flex items-center justify-center rounded-full border border-white/40 shadow-md font-semibold text-white text-sm uppercase z-10"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  <span className="relative text-sm font-medium text-gray-100 z-10">
                    {user.name}
                  </span>
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 mt-3 w-60 bg-[#0f172a]/95 border border-indigo-500/30 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-indigo-500/30">
                        <div
                          className="w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white uppercase"
                          style={{ backgroundColor: avatarColor }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600/30 transition"
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 transition text-left"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* Login pill */}
                <Link
                  to="/login"
                  className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/70 text-sm font-medium text-indigo-100 hover:text-white bg-white/5 hover:bg-indigo-600/30 shadow-[0_0_18px_rgba(79,70,229,0.35)] transition-all duration-300 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/25 via-purple-500/15 to-sky-500/25 opacity-0 group-hover:opacity-100 blur-lg" />
                  <LogIn
                    size={16}
                    className="relative group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                  />
                  <span className="relative">Login</span>
                </Link>

                <Link
                  to="/signup"
                  className="relative px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-sm font-semibold text-white shadow-lg hover:shadow-indigo-500/70 hover:scale-105 transition-transform duration-300"
                >
                  <span className="relative z-10">Sign Up</span>
                </Link>
              </>
            )}
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </motion.nav>
  );
}
