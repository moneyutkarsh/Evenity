import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaGithub, FaLinkedin, FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

// 🔗 Backend URL for OAuth redirects
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // Remember Me logic
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true"
  );

  const [formData, setFormData] = useState({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
  });

  const navigate = useNavigate();

  // ✅ Use login function (NOT setUser)
  const { login } = useAuth();

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  //    Handle Email Login
  // ============================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", formData);

      console.log("🔥 Login response:", res.data);

      const userObj = {
        id: res.data.user?.id || res.data.user?._id,
        name: res.data.user?.name || "User",
        email: res.data.user?.email || formData.email,
        token: res.data.token,
      };

      // Save to localStorage
      localStorage.setItem("eventlens_user", JSON.stringify(userObj));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", userObj.name);

      // Use AuthContext login() → fixes username everywhere
      login(userObj);

      // Remember Me
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("rememberedEmail");
      }

      // Hero animation state
      localStorage.setItem("authAction", "login");

      toast.success("🎉 Login Successful!", { icon: "🚀" });
      setTimeout(() => navigate("/events"), 1200);
    } catch (error) {
      console.error("❌ Login error:", error);
      const message =
        error.response?.data?.message || "Login failed ❌ Please try again.";
      toast.error(message, { icon: "⚠️" });
    }
  };

  // ============================
  //   OAuth Handlers
  // ============================
  const handleGoogleLogin = () => {
    localStorage.setItem("oauth_origin", "login");
    window.location.href = `${BACKEND_URL}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    localStorage.setItem("oauth_origin", "login");
    window.location.href = `${BACKEND_URL}/api/auth/github`;
  };

  const handleLinkedinLogin = () => {
    localStorage.setItem("oauth_origin", "login");
    window.location.href = `${BACKEND_URL}/api/auth/linkedin`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Banner */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 items-center justify-center text-center p-10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            Welcome Back 👋
          </h1>
          <p className="text-gray-200 mt-4 text-lg max-w-md mx-auto">
            Log in to{" "}
            <span className="text-yellow-300 font-semibold">Evenity</span> and
            continue exploring hackathons, workshops, and tech events 
          </p>
        </motion.div>

        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Right Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-center mb-6 text-sm">
            Log in to{" "}
            <span className="font-semibold text-indigo-400">Evenity</span> and
            continue your journey ✨
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Password */}
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

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4 rounded-md border-gray-400 cursor-pointer transition-transform hover:scale-110"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-400 hover:underline transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-700 transition"
            >
              Log In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="h-px flex-1 bg-white/20"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px flex-1 bg-white/20"></div>
          </div>

          {/* Social Login */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              <FaGoogle className="text-red-500" size={22} />
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              <FaGithub className="text-white" size={22} />
            </button>

            <button
              type="button"
              onClick={handleLinkedinLogin}
              className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
            >
              <FaLinkedin className="text-blue-400" size={22} />
            </button>
          </div>

          {/* Signup Redirect */}
          <p className="text-gray-400 text-center mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
