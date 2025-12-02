import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.svg";
import EvenityVideo from "../assets/Evenity.mp4";   // correct

export default function HeroSection() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [authAction, setAuthAction] = useState(localStorage.getItem("authAction"));

  // 🌟 NEW: Video Modal State
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthAction(localStorage.getItem("authAction"));
    };
    window.addEventListener("storage", handleStorageChange);

    const timer = setTimeout(() => {
      localStorage.removeItem("authAction");
      setAuthAction(null);
    }, 4000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearTimeout(timer);
    };
  }, []);

  const handleExploreClick = () => navigate("/events");

  return (
    <section className="relative bg-gray-900 text-white h-screen flex flex-col justify-center items-center overflow-hidden">
      
{/* 🌟 ULTRA-PREMIUM VIDEO POPUP MODAL */}
{showVideo && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[999] p-4"
    onClick={() => setShowVideo(false)} // click-outside closes modal
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="relative rounded-3xl overflow-hidden p-[3px]
                 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500
                 shadow-[0_0_45px_rgba(147,51,234,0.45)]
                 backdrop-blur-2xl w-full max-w-4xl"
      onClick={(e) => e.stopPropagation()} // avoid accidental close
    >
      
      {/* INNER WRAPPER WITH GLASS EFFECT */}
      <div className="bg-gray-900/80 rounded-3xl backdrop-blur-xl border border-white/10 overflow-hidden">

        {/* ❌ Glowing Close Button */}
        <button
          onClick={() => setShowVideo(false)}
          className="absolute top-5 right-5 text-white text-xl font-bold 
                     w-10 h-10 flex items-center justify-center
                     rounded-full bg-black/40 border border-white/20 
                     hover:bg-white/20 hover:scale-110 
                     shadow-[0_0_20px_rgba(255,255,255,0.3)]
                     hover:shadow-[0_0_25px_rgba(255,255,255,0.8)]
                     transition-all duration-200 z-50"
        >
          ✕
        </button>

        {/* 🌈 VIDEO WITH GRADIENT GLOW FRAME */}
        <div className="p-2 rounded-2xl bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-pink-500/40">
          <video
            controls
            autoPlay
            className="w-full rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]"
          >
            <source src={EvenityVideo} type="video/mp4" />
          </video>
        </div>

      </div>
    </motion.div>
  </motion.div>
)}

      {/* Top Navbar */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-4 z-20">
        <a href="/" className="cursor-pointer flex items-center gap-2">
          <img src={logo} alt="Evenity Logo" className="h-10" />
        </a>

        {user ? (
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 250, damping: 15 }}
              className="flex items-center gap-3 px-4 py-2 rounded-2xl
                        bg-gradient-to-r from-indigo-900/30 via-purple-800/30 to-blue-800/30
                        border border-indigo-500/40 shadow-[0_0_15px_rgba(79,70,229,0.3)]
                        hover:shadow-[0_0_25px_rgba(99,102,241,0.6)]
                        backdrop-blur-md transition-all duration-300 cursor-pointer group"
            >
              <div className="relative flex-shrink-0">
                <div className="rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500">
                  <div className="bg-gray-900 rounded-full w-9 h-9 overflow-hidden">
                    <img
                      src="/logos/profile.png"
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full shadow-sm"></span>
              </div>

              <div className="leading-tight text-sm">
                <p className="text-gray-200 font-medium group-hover:text-white transition-all duration-300">
                  Hey,{" "}
                  <span className="text-indigo-400 font-semibold">
                    {user.name || user.email.split("@")[0]}
                  </span>{" "}
                  👋
                </p>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-all duration-300">
                  Ready to explore events?
                </p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="px-5 py-2 rounded-xl border border-gray-700 
                        text-gray-300 font-semibold bg-gray-800/40 hover:bg-gray-700/60 
                        hover:text-white transition-all duration-300 shadow-md"
            >
              Logout
            </motion.button>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 border border-gray-400 text-gray-200 font-semibold rounded-lg hover:bg-gray-800 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition transform"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Background glowing shapes */}
      <div className="absolute top-0 left-0 w-full h-full">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute w-72 h-72 bg-purple-700 rounded-full opacity-20 -top-16 -left-16 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute w-96 h-96 bg-indigo-600 rounded-full opacity-15 -bottom-20 -right-32 blur-3xl"
        />
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-3xl">

        {user ? (
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-3xl text-gray-300"
          >
            Hey,{" "}
            <span className="text-indigo-400 font-semibold">
              {user.name || user.email.split("@")[0]}
            </span>{" "}
            —{" "}
            {authAction === "signup" ? (
              <>
                Welcome to <span className="text-pink-400 font-semibold">Evenity</span>
              </>
            ) : (
              <>
                Welcome back to <span className="text-pink-400 font-semibold">Evenity</span>
              </>
            )}
          </motion.h2>
        ) : (
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-2xl md:text-3xl text-gray-400"
          >
            Welcome to <span className="text-indigo-400 font-semibold">Evenity</span> 👋
          </motion.h2>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
        >
          Discover Amazing Tech Events
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-gray-200 tracking-wide"
        >
          Stay ahead with curated 
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> hackathons </span>,
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> workshops </span>,
          and 
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> tech events </span>
          — crafted to help you 
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> grow</span>, 
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> connect</span>, 
          and explore exciting new 
          <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> opportunities</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex space-x-4"
        >
          <button
            onClick={handleExploreClick}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition transform"
          >
            Explore Events
          </button>

          {/* 🔥 Watch Demo Button */}
          <button
            onClick={() => setShowVideo(true)}
            className="px-6 py-3 border border-gray-400 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 hover:border-gray-300 transition"
          >
            Explore the Demo
          </button>
        </motion.div>
      </div>

      {/* Logos */}
      <div className="absolute bottom-6 w-full px-8">
        <p className="text-center text-gray-400 mb-4">Events from top platforms</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-80">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png" className="h-11" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Kaggle_logo.png" className="h-10" />
          <img src="https://jsnation.com/img/logo.svg" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" className="h-8" />
          <img src="https://i.ibb.co/fC1QfJ7/blackhat-logo.png" className="h-10" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" className="h-10" />
        </div>
      </div>
    </section>
  );
}
