import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import {
  FaGithub,
  FaLinkedin,
  FaGoogle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

// 🔗 Backend URL for OAuth redirects
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const allRulesPassed = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match!", { icon: "⚠️" });
      return;
    }

    if (!allRulesPassed) {
      toast.error("⚠️ Please follow all password rules before signing up!");
      return;
    }

    try {
      const res = await API.post("/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const userObj = {
        name: res.data.user?.name || formData.name,
        email: res.data.user?.email || formData.email,
        token: res.data.token,
        id: res.data.user?.id || res.data.user?._id,
      };

      // ✅ Save to localStorage
      localStorage.setItem("eventlens_user", JSON.stringify(userObj));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", userObj.name);

      // ✅ Store signup action
      localStorage.setItem("authAction", "signup");

      // ✅ Update context
      setUser(userObj);

      toast.success(
        `🎉 Welcome aboard, ${userObj.name || "Explorer"}!`,
        { icon: "🌟" }
      );

      const from = location.state?.from?.pathname || "/";
      setTimeout(() => navigate(from, { replace: true }), 1500);
    } catch (err) {
      const message =
        err.response?.data?.message === "User already exists"
          ? "⚠️ User already exists. Try logging in!"
          : err.response?.data?.message || "❌ Signup failed!";
      toast.error(message, { icon: "⚠️" });
    }
  };

  // 🌐 OAuth Handlers – same flow as Login (signup via social)
  // IMPORTANT CHANGES ADDED ↓

const handleGoogleSignup = () => {
  localStorage.setItem("oauth_origin", "signup");
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};

const handleGithubSignup = () => {
  localStorage.setItem("oauth_origin", "signup");
  window.location.href = `${BACKEND_URL}/api/auth/github`;
};

const handleLinkedinSignup = () => {
  localStorage.setItem("oauth_origin", "signup");
  window.location.href = `${BACKEND_URL}/api/auth/linkedin`;
};


  return (
    <div className="min-h-screen flex">
      {/* Banner Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-700 items-center justify-center text-center p-10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            Join Evenity 🚀
          </h1>
          <p className="text-gray-200 mt-4 text-lg max-w-md mx-auto">
            Create your account and never miss{" "}
            <span className="text-yellow-300 font-semibold">
              hackathons, workshops, and tech events!
            </span>
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Signup Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Create Account
          </h2>
          <p className="text-gray-400 text-center mb-6 text-sm">
            Join <span className="font-semibold text-indigo-400">Evenity</span> and
            explore amazing events 
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="User Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <AiFillEyeInvisible size={22} />
                ) : (
                  <AiFillEye size={22} />
                )}
              </button>
            </div>

            {/* Password Rules */}
            <div className="text-sm space-y-1 mt-2">
              {Object.entries({
                "At least 8 characters": passwordRules.length,
                "One uppercase letter": passwordRules.uppercase,
                "One number": passwordRules.number,
                "One special character": passwordRules.special,
              }).map(([rule, passed], i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${
                    passed ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {passed ? (
                    <FaCheckCircle size={14} />
                  ) : (
                    <FaTimesCircle size={14} />
                  )}
                  <span>{rule}</span>
                </div>
              ))}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? (
                  <AiFillEyeInvisible size={22} />
                ) : (
                  <AiFillEye size={22} />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-semibold shadow-lg transition ${
                allRulesPassed
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!allRulesPassed}
            >
              Sign Up
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="h-px flex-1 bg-white/20"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px flex-1 bg-white/20"></div>
          </div>

          {/* Social Signup */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              <FaGoogle className="text-red-500" size={22} />
            </button>
            <button
              type="button"
              onClick={handleGithubSignup}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              <FaGithub className="text-white" size={22} />
            </button>
            <button
              type="button"
              onClick={handleLinkedinSignup}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              <FaLinkedin className="text-blue-400" size={22} />
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
