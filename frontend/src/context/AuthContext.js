import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // 🔄 Load user from localStorage
  // ================================
  useEffect(() => {
    try {
      const saved = localStorage.getItem("eventlens_user");

      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        console.log("✅ Loaded user:", parsed);
      } else {
        console.log("❌ No user found");
      }
    } catch (err) {
      console.error("LocalStorage load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ================================
  // 💾 Save user whenever state updates
  // ================================
  useEffect(() => {
    if (user) {
      localStorage.setItem("eventlens_user", JSON.stringify(user));

      // Legacy compatibility (optional)
      if (user.name) localStorage.setItem("userName", user.name);
      if (user.token) localStorage.setItem("token", user.token);
    }
  }, [user]);

  // ================================
  // 🚀 LOGIN FUNCTION (IMPORTANT FIX)
  // ================================
  const login = (userData) => {
    console.log("🔐 Logging in:", userData);
    setUser(userData); // Instantly updates navbar, dashboard, etc.
  };

  // ================================
  // 🚪 Logout
  // ================================
  const logout = () => {
    console.log("🚪 Logging out user");
    setUser(null);

    localStorage.removeItem("eventlens_user");
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // cleanup
  };

  // ================================
  // ⏳ Loading UI
  // ================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0f2c] to-[#1e293b]">
        <div className="text-white text-xl font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // ================================
  // 🌍 Provider
  // ================================
  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
