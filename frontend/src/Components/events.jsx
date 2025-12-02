import { useState, useEffect, useRef } from "react";
import EventCard from "./EventsCard";
import Footer from "./Footer";
import { motion } from "framer-motion";
import Gallery from "./Gallery";
import { Calendar, Sparkles } from "lucide-react";

const defaultEvents = [
  // 🚀 Hackathons
  {
    title: "Codeforces Hackathon",
    description: "Competitive programming challenges.",
    link: "https://codeforces.com",
    registerLink: "https://codeforces.com/register",
    ticketLink: null,
    logo: "/logos/codeforces.png",
    date: "Ongoing",
    category: "🚀 Hackathon",
    tags: ["hackathon", "coding", "competitive"],
    live: true,
    prizePool: "$5000",
    participants: 2000,
  },
  {
    title: "LeetCode Contest",
    description: "Weekly coding contests and problems.",
    link: "https://leetcode.com/contest/",
    registerLink: "https://leetcode.com/register",
    ticketLink: null,
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
    date: "Weekly",
    category: "🚀 Hackathon",
    tags: ["leetcode", "dsa", "coding"],
    prizePool: "$2000",
    participants: 1500,
  },
  {
    title: "GitHub Universe Hackathon 2026",
    description: "Build open-source tools and collaborate with developers worldwide.",
    link: "https://githubuniverse.com/",
    registerLink: "https://githubuniverse.com/register",
    logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    date: "Dec 2026",
    category: "🚀 Hackathon",
    tags: ["github", "open-source", "hackathon"],
    prizePool: "$20,000",
    participants: 6000,
  },
  {
    title: "ETHGlobal Hackathon",
    description: "Build and innovate in Web3 and blockchain development.",
    link: "https://ethglobal.com/",
    registerLink: "https://ethglobal.com/events",
    ticketLink: null,
    logo: "/logos/ethglobal.png",
    date: "Multiple 2026",
    category: "🚀 Hackathon",
    tags: ["blockchain", "web3", "ethereum"],
    prizePool: "$50,000",
    participants: 5000,
  },

  // 🌐 Web Development
  {
    title: "React India",
    description: "The biggest international React conference in India.",
    link: "https://www.reactindia.io/",
    registerLink: "https://www.reactindia.io/tickets",
    logo: "/logos/react.png",
    date: "Oct 2026",
    category: "🌐 Web Development",
    tags: ["react", "frontend", "india", "goa"],
    prizePool: "N/A",
    participants: 2500,
  },
  {
    title: "GopherCon India",
    description: "The premier conference for the Go programming language in India.",
    link: "https://www.gophercon.in/",
    registerLink: "https://www.gophercon.in/tickets",
    logo: "/logos/Gophercon.png",
    date: "Feb 2026",
    category: "🌐 Web Development",
    tags: ["golang", "backend", "india", "pune"],
    prizePool: "N/A",
    participants: 800,
  },
  {
    title: "JSNation",
    description: "JavaScript conference for web developers.",
    link: "https://jsnation.com/",
    registerLink: "https://jsnation.com/register",
    logo: "https://jsnation.com/img/logo.svg",
    date: "Jun 2026",
    category: "🌐 Web Development",
    tags: ["javascript", "node", "frontend"],
    prizePool: "N/A",
    participants: 3500,
  },
  {
    title: "Next.js Conf",
    description: "Conference by Vercel about Next.js & React.",
    link: "https://nextjs.org/conf",
    registerLink: "https://nextjs.org/register",
    logo: "/logos/nextjs.png",
    date: "Oct 2026",
    category: "🌐 Web Development",
    tags: ["nextjs", "vercel", "react"],
    prizePool: "N/A",
    participants: 4000,
  },
  {
    title: "Google I/O 2026",
    description: "Google's annual developer conference showcasing latest innovations.",
    link: "https://io.google/",
    registerLink: "https://io.google/register",
    logo: "/logos/googleio.png",
    date: "May 2026",
    category: "🌐 Web Development",
    tags: ["google", "android", "ai", "webdev"],
    prizePool: "N/A",
    participants: 100000,
  },

  // 🤖 AI/ML
  {
    title: "Kaggle Competitions",
    description: "Machine Learning challenges & datasets.",
    link: "https://www.kaggle.com/competitions",
    registerLink: "https://www.kaggle.com/register",
    ticketLink: null,
    logo: "https://www.kaggle.com/static/images/site-logo.png",
    date: "Ongoing",
    category: "🤖 AI/ML",
    tags: ["ml", "ai", "kaggle"],
    prizePool: "$10000",
    participants: 10000,
  },
  {
    title: "NeurIPS",
    description: "Top AI/ML research conference.",
    link: "https://nips.cc/",
    registerLink: "https://nips.cc/Register",
    logo: "/logos/Neur.png",
    date: "Dec 2025",
    category: "🤖 AI/ML",
    tags: ["research", "ml", "ai"],
    prizePool: "$50000",
    participants: 8000,
  },
  {
    title: "ICML 2026",
    description: "One of the top global conferences for machine learning research.",
    link: "https://icml.cc/",
    registerLink: "https://icml.cc/Conferences/2026/Register",
    logo: "https://research.sony/images/ICML-logo-con.png",
    date: "Jul 2026",
    category: "🤖 AI/ML",
    tags: ["ml", "research", "ai"],
    prizePool: "$70,000",
    participants: 12000,
  },
  {
    title: "TensorFlow Dev Summit",
    description: "Official TensorFlow conference for ML developers.",
    link: "https://www.tensorflow.org/dev-summit",
    registerLink: "https://www.tensorflow.org/dev-summit/register",
    logo: "/logos/tensorflow.png",
    date: "Mar 2026",
    category: "🤖 AI/ML",
    tags: ["tensorflow", "deep learning", "ai"],
    prizePool: "N/A",
    participants: 7000,
  },

  // ☁️ Cloud
  {
    title: "AWS Community Day - Bengaluru",
    description: "A community-led conference for AWS users.",
    link: "https://aws.amazon.com/developer/community/community-days/",
    registerLink: "https://awsugblr.in/communityday2026",
    logo: "/logos/awsblr.png",
    date: "Mar 2026",
    category: "☁️ Cloud",
    tags: ["aws", "cloud", "india", "bengaluru"],
    prizePool: "N/A",
    participants: 2000,
  },
  {
    title: "AWS re:Invent",
    description: "Amazon's biggest cloud computing conference.",
    link: "https://reinvent.awsevents.com/",
    registerLink: "https://register.reinventglobal.com",
    logo: "https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png",
    date: "Dec 2025",
    category: "☁️ Cloud",
    tags: ["aws", "cloud", "devops"],
    prizePool: "N/A",
    participants: 60000,
  },
  {
    title: "Google Cloud Next",
    description: "Annual cloud event by Google.",
    link: "https://cloud.withgoogle.com/next",
    registerLink: "https://cloud.withgoogle.com/next/register",
    logo: "https://cloud.google.com/images/social-icon-google-cloud-1200-630.png",
    date: "Apr 2026",
    category: "☁️ Cloud",
    tags: ["gcp", "cloud", "infrastructure"],
    prizePool: "N/A",
    participants: 4000,
  },
  {
    title: "DevOps India Summit",
    description: "Leading DevOps conference.",
    link: "https://www.devopsindiasummit.com/",
    registerLink: "https://www.devopsindiasummit.com/register",
    logo: "/logos/devopsindia.png",
    date: "Aug 2026",
    category: "☁️ Cloud",
    tags: ["devops", "ci/cd", "cloud"],
    prizePool: "N/A",
    participants: 5000,
  },

  // 🔒 Cybersecurity
  {
    title: "Nullcon Goa",
    description: "India's premier and largest cybersecurity conference.",
    link: "https://nullcon.net/",
    registerLink: "https://nullcon.net/website/register.php",
    logo: "/logos/nullcon.png",
    date: "Mar 2026",
    category: "🔒 Cybersecurity",
    tags: ["security", "hacking", "infosec", "india", "goa"],
    prizePool: "Varies",
    participants: 2000,
  },
  {
    title: "DEF CON 34",
    description: "The world's largest hacker convention.",
    link: "https://www.defcon.org/",
    registerLink: "https://www.defcon.org/html/defcon-34/dc-34-index.html",
    ticketLink: null, // Tickets are purchased in person at DEF CON
    logo: "/logos/defcon.png",
    date: "Aug 2026",
    category: "🔒 Cybersecurity",
    tags: ["security", "hacking", "infosec"],
    prizePool: "N/A",
    participants: 30000,
  },
  {
    title: "Black Hat USA",
    description: "Premier technical information security conference.",
    link: "https://www.blackhat.com/",
    registerLink: "https://www.blackhat.com/us-26/",
    logo: "/logos/blackhat.png",
    date: "Aug 2026",
    category: "🔒 Cybersecurity",
    tags: ["infosec", "cybersecurity", "corporate"],
    prizePool: "N/A",
    participants: 20000,
  },
  {
    title: "OWASP Global AppSec Asia 2026",
    description: "Leading application security event by OWASP.",
    link: "https://owasp.org/",
    registerLink: "https://owasp.org/events",
    logo: "https://owasp.org/assets/images/logo.png",
    date: "Nov 2026",
    category: "🔒 Cybersecurity",
    tags: ["security", "owasp", "appsec"],
    prizePool: "N/A",
    participants: 4000,
  },

  // 📢 CFP
  {
    title: "CFP: The Web Conference 2026",
    description: "Submit your research papers to the premier Web conference.",
    link: "https://www2026.thewebconf.org/",
    registerLink: "https://www2026.thewebconf.org/calls/papers/",
    ticketLink: null,
    logo: "/logos/Cfp.png",
    date: "Dec 5, 2025",
    category: "📢 CFP",
    tags: ["cfp", "research", "webdev"],
    prizePool: "N/A",
    participants: 0,
  },
  {
    title: "CFP: ACM Web Science Conference 2026",
    description: "Submit your research to the global Web Science community.",
    link: "https://websci.org/",
    registerLink: "https://websci.org/cfp",
    ticketLink: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNSXJT0Lcj8dLgeWemA8a9ceAu2FdlEHtojA&s",
    date: "Jan 20, 2026",
    category: "📢 CFP",
    tags: ["cfp", "research", "web"],
    prizePool: "N/A",
    participants: 0,
  },
  {
    title: "CFP: Open Source Summit",
    description: "Open Source Summit submission portal.",
    link: "https://events.linuxfoundation.org/open-source-summit-north-america/",
    registerLink: "https://events.linuxfoundation.org/open-source-summit-north-america/program/cfp/",
    ticketLink: null,
    logo: "/logos/opensource.png",
    date: "Jan 15, 2026",
    category: "📢 CFP",
    tags: ["cfp", "speaking", "opensource"],
    prizePool: "N/A",
    participants: 0,
  },
  {
    title: "FOSSASIA Summit",
    description: "Asia's leading open source technology event.",
    link: "https://fossasia.org/",
    registerLink: "https://eventyay.com/",
    logo: "/logos/fossasia.png",
    date: "Mar 2026",
    category: "📢 CFP",
    tags: ["opensource", "community", "foss"],
    prizePool: "N/A",
    participants: 4000,
  },

  // 🎤 Speaker Events
  {
    title: "TEDxBengaluru",
    description: "A TED-like experience hosted in Bengaluru.",
    link: "https://www.ted.com/tedx/events/54321",
    registerLink: "https://www.ted.com/tedx/events/54321",
    logo: "/logos/tedx.png",
    date: "May 2026",
    category: "🎤 Speaker Events",
    tags: ["public speaking", "ideas", "india", "bengaluru"],
    prizePool: "N/A",
    participants: 500,
  },
  {
    title: "DevRelCon",
    description: "Conference for Developer Relations professionals.",
    link: "https://devrelcon.com/",
    registerLink: "https://london.devrel.net/",
    logo: "/logos/devrelcon.png",
    date: "Jun 2026",
    category: "🎤 Speaker Events",
    tags: ["devrel", "community", "speaking"],
    prizePool: "N/A",
    participants: 400,
  },

  // 🤝 Networking
  {
    title: "Silicon Valley Tech Mixer 2026",
    description: "A global networking meetup for founders, engineers & VCs.",
    link: "https://www.eventbrite.com/e/sf-startup-tech-mixer-2026-tickets-1975643604203",
    registerLink: "https://www.eventbrite.com/e/sf-startup-tech-mixer-2026-tickets-1975643604203",
    ticketLink: null,
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTkWWUFSTKhNLXmpXZyie5jTOWsapzT52ajA&s",
    date: "Feb 2026",
    category: "🤝 Networking",
    tags: ["networking", "founders", "global"],
    prizePool: "N/A",
    participants: 500,
  },
  {
    title: "Startup Grind Global Conference",
    description: "Connect with startups, investors, and innovators worldwide.",
    link: "https://www.startupgrind.com/conference/",
    registerLink: "https://www.startupgrind.com/conference/tickets/",
    logo: "/logos/global.png",
    date: "Apr 2026",
    category: "🤝 Networking",
    tags: ["startups", "vc", "networking"],
    prizePool: "N/A",
    participants: 10000,
  },
  {
    title: "Women Who Code CONNECT India",
    description: "Empowering women in tech.",
    link: "https://www.womenwhocode.com/",
    registerLink: "https://www.womenwhocode.com/events",
    logo: "/logos/wwcode.png",
    date: "Mar 2026",
    category: "🤝 Networking",
    tags: ["diversity", "tech", "women"],
    prizePool: "N/A",
    participants: 2000,
  },
];


const placeholderTexts = [
  "🔍 Search events...",
  "💻 Find Hackathons...",
  "🤖 Explore AI/ML...",
  "☁️ Discover Cloud events...",
  "🛡️ Cybersecurity conferences...",
];

const Events = () => {
  const [eventsData, setEventsData] = useState(defaultEvents);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("✨ All");
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [placeholder, setPlaceholder] = useState(placeholderTexts[0]);
  const placeholderIndex = useRef(0);

  // Animate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      placeholderIndex.current =
        (placeholderIndex.current + 1) % placeholderTexts.length;
      setPlaceholder(placeholderTexts[placeholderIndex.current]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Load custom events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
      setEventsData([...defaultEvents, ...savedEvents]);
    };
    
    loadEvents();
    
    // Listen for storage events (when new events are added)
    window.addEventListener("storage", loadEvents);
    return () => window.removeEventListener("storage", loadEvents);
  }, []);

  // Load bookmarked events
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarkedEvents")) || [];
    setBookmarkedEvents(saved);
  }, []);

  // Save bookmarked events
  useEffect(() => {
    localStorage.setItem("bookmarkedEvents", JSON.stringify(bookmarkedEvents));
  }, [bookmarkedEvents]);

  const toggleBookmark = (event) => {
    if (bookmarkedEvents.some((e) => e.title === event.title)) {
      setBookmarkedEvents(
        bookmarkedEvents.filter((e) => e.title !== event.title)
      );
    } else {
      setBookmarkedEvents([...bookmarkedEvents, event]);
    }
  };

  const categories = [
    "🚀 Hackathon",
    "🌐 Web Development",
    "🤖 AI/ML",
    "☁️ Cloud",
    "🔒 Cybersecurity",
    "🎤 Speaker Events",
    "📢 CFP",
    "🤝 Networking",
  ];

  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "✨ All" || event.category === category;

    let matchesDate = true;
    if (startDate || endDate) {
      const eventDateStr = event.date;
      // Handle various date formats
      if (eventDateStr && !eventDateStr.toLowerCase().includes("ongoing") && !eventDateStr.toLowerCase().includes("weekly")) {
        const eventDate = new Date(eventDateStr);
        if (!isNaN(eventDate.getTime())) {
          if (startDate && eventDate < new Date(startDate)) matchesDate = false;
          if (endDate && eventDate > new Date(endDate)) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  const upcomingEvents = filteredEvents.filter(
    (event) => event.live || (event.date && event.date.includes("2025"))
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Dark Blue Shady Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-900 to-gray-900 z-0"></div>

      {/* Twinkling Stars Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(80)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.2,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Content */}
      <div className="relative z-10 text-white">
        <br />
        <br />
        <br />

        <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="p-16 text-center relative z-10"
>
  {/* Title Capsule */}
  <div className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-2xl 
  bg-gradient-to-r from-blue-500/20 via-blue-400/20 to-blue-300/20
  backdrop-blur-md border border-white/10 mb-6">

  <span className="text-4xl animate-bounce">📈</span>

  <h1 className="text-5xl md:text-6xl font-extrabold 
    bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600
    bg-clip-text text-transparent">
    Stay ahead. Stay updated. Stay winning.
  </h1>
</div>



  {/* Subtitle */}
  <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
    Discover{" "}
    <span className="text-purple-400 font-semibold">Hackathons</span>,{" "}
    <span className="text-indigo-400 font-semibold">AI/ML Summits</span>,{" "}
    <span className="text-pink-400 font-semibold">Cloud</span>,{" "}
    <span className="text-cyan-400 font-semibold">Cybersecurity</span> and{" "}
    <span className="text-amber-400 font-semibold">CFPs</span> — all in one place ✨
  </p>
</motion.div>

        <Gallery/>
        
        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row justify-center gap-4 px-10 mt-8 flex-wrap md:flex-nowrap items-center">
          {/* Search Bar */}
          <motion.div className="relative w-full md:w-1/4">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="text"
              placeholder={placeholder}
              className="px-4 py-3 rounded-xl w-full text-black focus:outline-none bg-gray-100 placeholder-gray-500 font-medium transition-shadow duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          {/* Category Dropdown */}
          <motion.select
            whileFocus={{ scale: 1.02 }}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="px-4 py-3 rounded-xl text-black w-full md:w-1/5 focus:outline-none bg-gray-100 font-medium transition-shadow duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="✨ All">✨ All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </motion.select>

          {/* Start Date */}
          <motion.div className="relative w-full md:w-1/6">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="date"
              className="pl-10 pr-4 py-3 rounded-xl w-full text-black focus:outline-none bg-gray-100 font-medium transition-shadow duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </motion.div>

          {/* End Date */}
          <motion.div className="relative w-full md:w-1/6">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={18}
            />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              type="date"
              className="pl-10 pr-4 py-3 rounded-xl w-full text-black focus:outline-none bg-gray-100 font-medium transition-shadow duration-300 focus:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Upcoming & Live Events */}
        {upcomingEvents.length > 0 && (
          <div className="px-10 mt-12">
            <h2 className="text-3xl font-bold mb-6 text-purple-400">
              🔥 Upcoming & Live Events
            </h2>
            <EventCard
              eventsData={upcomingEvents}
              toggleBookmark={toggleBookmark}
              bookmarkedEvents={bookmarkedEvents}
            />
          </div>
        )}

        {/* 🌍 Weekly Global Events */}
        <div className="px-10 mt-12">
          <h2 className="text-3xl font-bold mb-6 text-green-400">
            🌍 Weekly Global Events
          </h2>
          <EventCard
            eventsData={filteredEvents.filter(
              (event) =>
                event.date.toLowerCase().includes("weekly") ||
                event.date.toLowerCase().includes("ongoing")
            )}
            toggleBookmark={toggleBookmark}
            bookmarkedEvents={bookmarkedEvents}
          />
        </div>

        {/* Categorized Sections */}
        {categories.map(
          (cat) =>
            filteredEvents.some((e) => e.category === cat) && (
              <div key={cat} className="px-10 mt-12">
                <h2 className="text-3xl font-bold mb-6 text-blue-400">
                  {cat}
                </h2>
                <EventCard
                  eventsData={filteredEvents.filter(
                    (event) => event.category === cat
                  )}
                  toggleBookmark={toggleBookmark}
                  bookmarkedEvents={bookmarkedEvents}
                />
              </div>
            )
        )}
        <br />
        <Footer />
      </div>
    </div>
  );
};

export default Events;