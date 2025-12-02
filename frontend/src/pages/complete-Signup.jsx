git remote addimport React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaEnvelope, FaUserTag } from "react-icons/fa";

export default function CompleteSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  // Extract details from URL
  const params = new URLSearchParams(location.search);
  const email = params.get("email");
  const name = params.get("name");
  const googleId = params.get("googleId"); // ⭐ VERY IMPORTANT

  const [username, setUsername] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error("⚠️ Username is required!");
      return;
    }

    try {
      // ⭐ MUST SEND googleId TO BACKEND
      const res = await API.post("/auth/google/complete-signup", {
        email,
        name,
        username,
        googleId,
      });

      const token = res.data.token;

      const userObj = {
        name,
        email,
        username,
        token,
      };

      localStorage.setItem("eventlens_user", JSON.stringify(userObj));
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);

      setUser(userObj);

      toast.success("🎉 Signup completed successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong during signup");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Background glow */}
      <div className="absolute w-[700px] h-[700px] rounded-full bg-indigo-600 opacity-10 blur-[140px] -top-20 -left-20" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600 opacity-10 blur-[150px] bottom-0 right-0" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-white/10 relative z-10"
      >
        <h2 className="text-4xl font-extrabold text-center mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text drop-shadow-lg">
          Complete Your Signup 🎉
        </h2>

        <p className="text-center text-gray-300 mb-8 text-sm">
          Welcome {name?.split(" ")[0]}! Choose a username to finish.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Name</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={name}
                disabled
                className="w-full pl-10 p-3 rounded-xl bg-white/10 border border-white/20 text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300 mb-1 block">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                value={email}
                disabled
                className="w-full pl-10 p-3 rounded-xl bg-white/10 border border-white/20 text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-200 mb-1 block">Choose Username</label>
            <div className="relative">
              <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g., utkarsh_dubey, maverick007"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition font-semibold shadow-lg text-white"
          >
            Finish Signup
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
