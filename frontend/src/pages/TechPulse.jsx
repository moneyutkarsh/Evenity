import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper, Globe } from "lucide-react";

export default function TechPulse() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: "The Rise of AI in 2025",
      excerpt: "How AI is shaping our world...",
      image: "/Techpulse photos/news1.png",
    },
    {
      id: 2,
      title: "Top 10 Hackathons to Join",
      excerpt: "Find the most exciting hackathons...",
      image: "/Techpulse photos/news2.png",
    },
    {
      id: 3,
      title: "Future of Web3",
      excerpt: "Decentralized web and its potential...",
      image: "/Techpulse photos/news3.png",
    },
    {
      id: 4,
      title: "Cloud Computing in 2025",
      excerpt: "The shift towards serverless architecture...",
      image: "/Techpulse photos/news4.png",
    },
    {
      id: 5,
      title: "Cybersecurity Trends",
      excerpt: "How to stay safe in the digital age...",
      image: "/Techpulse photos/news5.png",
    },
    {
      id: 6,
      title: "Future of Startups",
      excerpt: "Where the next unicorns will rise...",
      image: "/Techpulse photos/news6.png",
    },
  ];

  useEffect(() => {
    async function fetchNews() {
      const apiKey = process.env.REACT_APP_MEDIASTACK_API;
      if (!apiKey) {
        setError("Missing Mediastack API key.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://api.mediastack.com/v1/news?access_key=${apiKey}&categories=technology&languages=en&limit=6`
        );
        if (!res.ok) throw new Error("Failed to fetch Mediastack news.");

        const data = await res.json();
        setNews(data?.data || []);
      } catch (err) {
        console.error("❌ Error fetching Mediastack news:", err);
        setError("Unable to fetch latest tech news. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white py-24 px-6 relative overflow-hidden">
      {/* Background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center mb-16 z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <Newspaper className="text-indigo-400" size={32} />
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]">
            Featured Articles
          </h1>
        </div>
        <p className="text-gray-400 text-sm sm:text-base">
          Stay informed with handpicked tech stories and innovations 💡
        </p>
      </motion.div>

      {/* Articles Section */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24 relative z-10">
        {blogPosts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.04 }}
            className="group bg-[#0f172a]/70 backdrop-blur-lg rounded-2xl overflow-hidden border border-indigo-500/20 shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:shadow-[0_0_40px_rgba(99,102,241,0.35)] transition-all duration-500"
          >
            <div className="overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-400 transition">
                {post.title}
              </h3>
              <p className="text-gray-400 mb-3">{post.excerpt}</p>
              <Link
                to={`/techpulse/${post.id}`}
                className="inline-block text-indigo-400 hover:text-purple-400 font-medium transition"
              >
                Read More →
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="relative z-10 text-center mb-14">
        <h2 className="inline-flex items-center gap-2 text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          <Globe size={28} /> Latest Tech News
        </h2>
        <div className="w-28 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Live Tech News */}
      <div className="max-w-7xl mx-auto relative z-10">
        {loading && (
          <p className="text-gray-400 text-center animate-pulse">
            Fetching the latest tech updates...
          </p>
        )}

        {error && <p className="text-red-400 text-center">{error}</p>}

        {!loading && !error && news.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {news.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-[#1e293b]/70 border border-indigo-500/20 backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-500"
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover hover:brightness-110 transition"
                  />
                )}
                <div className="p-5">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="text-lg font-semibold hover:text-indigo-400 transition mb-2">
                      {article.title}
                    </h3>
                  </a>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-3">
                    {article.description || "No description available."}
                  </p>
                  <p className="text-xs text-gray-500">
                    {article.source || "Unknown source"} •{" "}
                    {new Date(article.published_at).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <p className="text-gray-400 text-center">
            No tech news available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
