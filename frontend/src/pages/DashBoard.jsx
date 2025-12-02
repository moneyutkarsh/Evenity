import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  TrendingUp,
  Star,
  ShieldCheck,
  Zap,
  BrainCircuit,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // Mock weekly data
  const eventData = [
    { week: "Week 1", events: 8 },
    { week: "Week 2", events: 12 },
    { week: "Week 3", events: 19 },
    { week: "Week 4", events: 23 },
    { week: "Week 5", events: 27 },
    { week: "Week 6", events: 27 },
    { week: "Week 7", events: 30 },
  ];

  const performance = [
    { label: "Reach", value: 86 },
    { label: "Activity", value: 78 },
    { label: "Retention", value: 91 },
  ];

  const badges = [
    {
      icon: <ShieldCheck size={24} />,
      title: "Trusted Creator",
      desc: "Maintained 95% positive feedback across all submissions.",
    },
    {
      icon: <Star size={24} />,
      title: "Top Rated",
      desc: "Among top 10% of creators based on engagement score.",
    },
    {
      icon: <Zap size={24} />,
      title: "Consistency Pro",
      desc: "Created content for 7 consecutive weeks.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center text-indigo-400 mb-10"
      >
        Creator Dashboard
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { icon: <Calendar size={24} />, label: "Total Events", value: 30 },
          { icon: <Users size={24} />, label: "Active Participants", value: 356 },
          { icon: <TrendingUp size={24} />, label: "Engagement Rate", value: "92%" },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-[#1e293b]/70 backdrop-blur-lg border border-indigo-500/20 rounded-xl p-6 text-center shadow-lg hover:shadow-indigo-700/40 transition"
          >
            <div className="text-indigo-400 mx-auto mb-3">{item.icon}</div>
            <p className="text-gray-400 text-sm">{item.label}</p>
            <h3 className="text-2xl font-semibold mt-1">{item.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-5xl mx-auto mt-16 bg-[#1e293b]/80 p-6 rounded-2xl border border-indigo-500/30 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
          <TrendingUp size={20} /> Event Growth Trend
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={eventData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="week" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #4f46e5",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#c7d2fe" }}
            />
            <Line
              type="monotone"
              dataKey="events"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto mt-16 bg-[#1e293b]/70 p-6 rounded-2xl border border-indigo-500/20"
      >
        <h2 className="text-xl font-semibold text-indigo-400 mb-6">
          Performance Overview
        </h2>
        <div className="space-y-5">
          {performance.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <p>{item.label}</p>
                <p>{item.value}%</p>
              </div>
              <div className="w-full bg-gray-700/40 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-6"
      >
        {badges.map((badge, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1e293b]/70 p-5 border border-indigo-500/20 rounded-2xl shadow-md hover:shadow-indigo-600/40 transition"
          >
            <div className="text-indigo-400 mb-3">{badge.icon}</div>
            <h3 className="text-lg font-semibold">{badge.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{badge.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
