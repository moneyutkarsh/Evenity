import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ import your auth context

const SavedEventsContext = createContext(null);

export function SavedEventsProvider({ children }) {
  const { user } = useAuth(); // ✅ get currently logged-in user
  const [saved, setSaved] = useState([]);

  // 🧠 Helper: generate a unique storage key per user
  const getUserKey = () => {
    if (user && user.email) return `savedEvents_${user.email}`;
    return "savedEvents_guest"; // fallback for guests
  };

  // 🔁 Load saved events whenever user changes (login/logout)
  useEffect(() => {
    try {
      const key = getUserKey();
      const raw = localStorage.getItem(key);
      setSaved(raw ? JSON.parse(raw) : []);
    } catch {
      setSaved([]);
    }
  }, [user]); // reload on user change

  // 💾 Persist changes to correct user-specific localStorage
  useEffect(() => {
    try {
      const key = getUserKey();
      localStorage.setItem(key, JSON.stringify(saved));
    } catch {}
  }, [saved, user]);

  return (
    <SavedEventsContext.Provider value={{ saved, setSaved }}>
      {children}
    </SavedEventsContext.Provider>
  );
}

// Custom hook for easier usage
export function useSavedEvents() {
  return useContext(SavedEventsContext);
}
