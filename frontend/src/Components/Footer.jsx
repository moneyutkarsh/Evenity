import { FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "framer-motion";

const quickAccess = [
  { name: "Discover Events", type: "route", to: "/events" },
  { name: "Saved Events", type: "route", to: "/saved" },
  { name: "TechPulse News", type: "route", to: "/techpulse" },
];

const socialLinks = [
  { icon: FaLinkedin, href: "#", bg: "hover:bg-blue-500" },
  { icon: FaTwitter, href: "#", bg: "hover:bg-sky-400" },
  { icon: FaInstagram, href: "#", bg: "hover:bg-pink-500" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative text-gray-300"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1e293b]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white">Evenity</h2>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Your one-stop platform for hackathons, workshops, and tech events. 🚀
          </p>
        </div>

        {/* Quick Access */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Access</h3>
          <ul className="space-y-2 text-sm">
            {quickAccess.map((item) => (
              <li key={item.name}>
                {item.type === "route" ? (
                  <RouterLink
                    to={item.to}
                    className="hover:text-indigo-400 transition"
                  >
                    {item.name}
                  </RouterLink>
                ) : (
                  <ScrollLink
                    to={item.to}
                    smooth={true}
                    duration={600}
                    offset={-80}
                    className="cursor-pointer hover:text-indigo-400 transition"
                  >
                    {item.name}
                  </ScrollLink>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Socials */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
          <p className="text-sm text-gray-400">
            📧 Email:{" "}
            <a
              href="mailto:support@Evenity.com"
              className="hover:text-indigo-400"
            >
              support@Evenity.com
            </a>
          </p>
          <p className="mt-2 text-sm text-gray-400">
            ℹ️{" "}
            <RouterLink to="/about" className="hover:text-indigo-400">
              About
            </RouterLink>
          </p>

          {/* Socials */}
          <div className="flex gap-4 mt-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  className={`p-2 bg-white/10 rounded-full border border-gray-700 transition ${social.bg}`}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 pt-6 pb-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-indigo-400 font-semibold">Evenity</span>. All
        rights reserved.
      </div>
    </motion.footer>
  );
}
