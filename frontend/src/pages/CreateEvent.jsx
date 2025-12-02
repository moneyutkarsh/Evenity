import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Tag,
  Layers,
  FileText,
  Rocket,
  Image as ImageIcon,
  Link2, // ✅ New icon
} from "lucide-react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    category: "",
    tags: "",
    link: "", // ✅ Added field
    description: "",
    poster: null,
  });

  const [preview, setPreview] = useState(null);

  const categories = [
    "🚀 Hackathon",
    "🌐 Web Development",
    "🤖 AI/ML",
    "☁️ Cloud",
    "🛡️ CyberSecurity",
    "🎤 Speaker",
    "🤝 Networking",
    "📢 CFP",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, poster: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

    // Validate link (optional but nice UX)
    if (formData.link && !formData.link.startsWith("http")) {
      alert("⚠️ Please enter a valid URL (starting with http or https)");
      return;
    }

    let posterBase64 = null;
    if (formData.poster) {
      const reader = new FileReader();
      reader.onloadend = () => {
        posterBase64 = reader.result;

        const updatedEvents = [
          ...storedEvents,
          { ...formData, poster: posterBase64 },
        ];

        localStorage.setItem("events", JSON.stringify(updatedEvents));

        alert("✅ Event Created & Saved Successfully!");
        resetForm();
      };
      reader.readAsDataURL(formData.poster);
    } else {
      const updatedEvents = [...storedEvents, formData];
      localStorage.setItem("events", JSON.stringify(updatedEvents));

      alert("✅ Event Created & Saved Successfully!");
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      location: "",
      category: "",
      tags: "",
      link: "",
      description: "",
      poster: null,
    });
    setPreview(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* ✅ Banner Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-purple-700 to-pink-700 items-center justify-center text-center p-10 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            🚀 Launch Your Event
          </h1>
          <p className="text-gray-200 mt-4 text-lg max-w-md mx-auto">
            Share your hackathon, workshop, or tech conference with the world.  
            Make it memorable with <span className="text-yellow-300">Evenity</span>.
          </p>
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* ✅ Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-gray-800"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-blue-400 flex items-center justify-center gap-2">
              <Rocket className="w-8 h-8 text-pink-400" />
              Create New Event
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Fill out the details to add your event to{" "}
              <span className="text-blue-300">Evenity</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block mb-2 font-semibold">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" /> Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" /> Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter event location"
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-green-400" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4 text-yellow-400" /> Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. AI, Web3, Cloud"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
            </div>

            {/* ✅ Event Link */}
            <div>
              <label className="block mb-2 font-semibold flex items-center gap-2">
                <Link2 className="w-4 h-4 text-cyan-400" /> Event Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                placeholder="https://devfolio.co/events/myhackathon"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
            </div>

            {/* Poster Upload */}
            <div>
              <label className="block mb-2 font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-400" /> Event Poster
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
              />
              {preview && (
                <div className="mt-3">
                  <p className="text-gray-400 text-sm mb-2">Preview:</p>
                  <img
                    src={preview}
                    alt="Event Poster Preview"
                    className="w-full max-h-60 object-cover rounded-lg border border-gray-700 shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" /> Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description about the event..."
                rows="4"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                required
              ></textarea>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-bold text-lg shadow-lg hover:opacity-90 transition"
            >
              🚀 Create Event
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
