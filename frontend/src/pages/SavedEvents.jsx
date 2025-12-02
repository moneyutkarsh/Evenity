import React from "react";
import { motion } from "framer-motion";
import { useSavedEvents } from "./SavedEventsContext";
import EventsCard from "../Components/EventsCard";
import { Bookmark } from "lucide-react";

const SavedEvents = () => {
  const { saved } = useSavedEvents();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white pt-28 pb-16 px-6 relative overflow-hidden">
      {/* ✨ Subtle Dotted Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* ⭐ Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Bookmark size={28} className="text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]">
            Saved Events
          </h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base flex justify-center items-center gap-1">
          Here are the events you’ve bookmarked — keep track of your favorites{" "}
          <span className="animate-spin-slow">💫</span>
        </p>
      </motion.div>

      {/* ⭐ Saved Events Section */}
      {saved.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center justify-center text-center mt-20 relative z-10"
        >
          <h2 className="text-2xl font-semibold text-gray-200">
            No saved events yet.
          </h2>
          <p className="text-gray-400 mt-2">
            Browse and save events to keep them here for easy access.
          </p>
          <a
            href="/events"
            className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full 
                     hover:scale-105 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all duration-300 
                     text-white font-semibold shadow-md"
          >
            Explore Events
          </a>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          // UPDATED: Changed max-w-6xl to max-w-7xl for wider cards
          className="max-w-7xl mx-auto relative z-10"
        >
          <EventsCard eventsData={saved} />
        </motion.div>
      )}
    </div>
  );
};

export default SavedEvents;
