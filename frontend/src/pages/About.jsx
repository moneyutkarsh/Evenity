import Navbar from "../Components/NavBar";
import { FaCalendarAlt, FaUsers, FaTrophy, FaGlobe } from "react-icons/fa";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#121232] text-white">
      <Navbar />

      {/* Container */}
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          About <span className="text-indigo-400">Evenity</span>
        </h1>

        <p className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto">
          Evenity is your go-to platform for discovering hackathons, workshops,
          and conferences worldwide. Our mission is to connect developers, tech
          enthusiasts, and innovators with the best opportunities to grow,
          collaborate, and showcase their skills.
        </p>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {/* Event Discovery */}
          <div className="p-6 bg-white/5 rounded-2xl shadow-lg text-center hover:bg-white/10 hover:-translate-y-1 transition-transform duration-300">
            <FaCalendarAlt className="text-indigo-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Discover Events</h3>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Find upcoming hackathons, workshops, and meetups across the globe.
              Filter events by location, domain, or skill level to match your
              interests.
            </p>
          </div>

          {/* Community Networking */}
          <div className="p-6 bg-white/5 rounded-2xl shadow-lg text-center hover:bg-white/10 hover:-translate-y-1 transition-transform duration-300">
            <FaUsers className="text-indigo-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Connect & Collaborate</h3>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Meet like-minded developers, form teams, and share ideas. Build
              long-lasting connections with peers and mentors worldwide.
            </p>
          </div>

          {/* Achievements */}
          <div className="p-6 bg-white/5 rounded-2xl shadow-lg text-center hover:bg-white/10 hover:-translate-y-1 transition-transform duration-300">
            <FaTrophy className="text-indigo-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Track Achievements</h3>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Showcase your participation, wins, and milestones. Let your
              EventHub profile highlight your achievements to recruiters and
              collaborators.
            </p>
          </div>

          {/* Global Reach */}
          <div className="p-6 bg-white/5 rounded-2xl shadow-lg text-center hover:bg-white/10 hover:-translate-y-1 transition-transform duration-300">
            <FaGlobe className="text-indigo-400 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Global Opportunities</h3>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Access opportunities from every corner of the world. Participate
              virtually or in person in global events that help you grow your
              career.
            </p>
          </div>
        </div>

        {/* Closing Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold">Why EventHub?</h2>
          <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
            We believe in making tech opportunities accessible to everyone. With
            EventHub, you don’t just attend events—you become part of a thriving
            global developer community. 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
