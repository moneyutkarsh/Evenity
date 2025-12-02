import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.", { icon: "⚠️" });
      return;
    }

    setLoading(true);
    try {
      // ✅ API call to backend endpoint
      const res = await API.post("/users/forgot-password", { email });

      toast.success("📩 Password reset link sent! Check your inbox.", {
        icon: "✉️",
      });

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "❌ Failed to send reset link.",
        { icon: "⚠️" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* 🌟 Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">Forgot Password? 🔒</h2>
          <p className="text-gray-400 text-sm">
            Enter your registered email address to receive a password reset link.
          </p>
        </div>

        {/* ✉️ Form */}
        <form onSubmit={handleReset} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition shadow-lg ${
              loading
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
            }`}
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        {/* 🔙 Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-400 font-semibold hover:underline transition"
          >
            ← Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
