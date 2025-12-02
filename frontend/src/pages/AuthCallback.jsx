import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // 🛑 Prevent double execution in Strict Mode
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        toast.error("❌ OAuth login failed. No token received.", {
          icon: "⚠️",
        });
        navigate("/login", { replace: true });
        return;
      }

      try {
        // Save token
        localStorage.setItem("token", token);

        // Detect login/signup
        const origin = localStorage.getItem("oauth_origin");

        // Fetch logged-in user from backend
        const res = await API.get("/users/me");
        const userData = res.data?.user || res.data;

        const userObj = {
          name: userData?.name || "User",
          email: userData?.email || "",
          id: userData?._id || userData?.id,
          avatar: userData?.avatar || "",
          token,
        };

        localStorage.setItem("eventlens_user", JSON.stringify(userObj));
        localStorage.setItem("userName", userObj.name);

        setUser(userObj);

        // ===========================
        // 🎉 SHOW CORRECT TOAST
        // ===========================
        if (origin === "signup") {
          toast.success("🎉 Signup Successful!", { icon: "🌟" });
        } else {
          toast.success("🎉 Login Successful!", { icon: "🚀" });
        }

        localStorage.removeItem("oauth_origin");

        setTimeout(() => navigate("/events", { replace: true }), 1000);
      } catch (error) {
        console.error("OAuth callback error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("eventlens_user");

        const message =
          error.response?.data?.message ||
          "OAuth login failed. Please try again.";

        toast.error(message, { icon: "⚠️" });
        navigate("/login", { replace: true });
      }
    };

    handleOAuthCallback();
  }, [location.search, navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Completing Sign In
          </h2>

          <p className="text-gray-300 mb-6 text-sm">
            Please wait while we connect your{" "}
            <span className="text-indigo-400 font-semibold">EventLens</span>{" "}
            account 🔐
          </p>

          <motion.div
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          />

          <p className="text-gray-500 text-xs mt-6">
            Do not close this window. You’ll be redirected shortly.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
