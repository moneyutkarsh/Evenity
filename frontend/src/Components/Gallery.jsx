import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

import event1 from "../assets/gallery/event1.png";
import event2 from "../assets/gallery/event2.png";
import event3 from "../assets/gallery/event3.png";
import event4 from "../assets/gallery/event4.png";
import event5 from "../assets/gallery/event5.png";
import event6 from "../assets/gallery/event6.png";

const eventDetails = [
  {
    title: "🤖 Ai Summit & Workshop",
    date: "December 20, 2025",
    image: event1,
  },
  {
    title: "☁️ Cloud Event",
    date: "December 23, 2025",
    image: event2,
  },
  {
    title: "🌐 Modern Web Dev Workshop",
    date: "January 7, 2026",
    image: event3,
  },
  {
    title: "🚀 CodeCrafts Hackathon",
    date: "February 10, 2026",
    image: event4,
  },
  {
    title: "🤝 Innovator’s Networking Gala",
    date: "March 8, 2026",
    image: event5,
  },
  {
    title: "🔒 CybserSecurity Threat Landscape Summit",
    date: "February 15, 2026",
    image: event6,
  },
];

// Animation Variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
    scale: 0.97,
  }),
};

const textContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const textItem = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// 🔥 Modal Variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const Gallery = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const nextSlide = () => {
    setDirection(1);
    setCurrent((prev) => (prev === eventDetails.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? eventDetails.length - 1 : prev - 1));
  };

  // Auto Slide
  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(timer);
  }, [current]);

  // Swipe gestures
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-12 select-none" {...handlers}>
      {/* Gallery Card */}
      <div className="overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.25)] transition-all duration-500 hover:shadow-[0_0_40px_rgba(147,51,234,0.4)]">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 200, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            className="relative"
          >
            <img
              src={eventDetails[current].image}
              alt={eventDetails[current].title}
              className="w-full h-[300px] sm:h-[400px] md:h-[450px] object-cover rounded-2xl brightness-95 hover:brightness-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-2xl"></div>

            {/* Event Text */}
            <motion.div
              variants={textContainer}
              initial="hidden"
              animate="show"
              className="absolute bottom-10 left-10 text-left text-white backdrop-blur-sm bg-black/20 p-5 rounded-xl"
            >
              <motion.h3
                variants={textItem}
                className="text-2xl sm:text-3xl font-extrabold drop-shadow-lg"
              >
                {eventDetails[current].title}
              </motion.h3>
              <motion.p
                variants={textItem}
                className="mt-1 text-lg opacity-90 font-medium"
              >
                {eventDetails[current].date}
              </motion.p>
              <motion.button
                variants={textItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openModal}
                className="mt-4 bg-white/90 text-black px-5 py-2 rounded-full font-semibold shadow-md hover:bg-blue-600 hover:text-white transition"
              >
                RSVP Now
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -left-14 transform -translate-y-1/2 bg-gradient-to-r from-gray-800/90 to-black/80 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        &#10094;
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 -right-14 transform -translate-y-1/2 bg-gradient-to-l from-gray-800/90 to-black/80 text-white p-4 rounded-full shadow-lg hover:scale-110 hover:from-indigo-600 hover:to-purple-700 transition-all"
      >
        &#10095;
      </button>

      {/* Dots */}
      <div className="flex justify-center mt-6 gap-3">
        {eventDetails.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              current === index
                ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125 shadow-[0_0_10px_rgba(147,51,234,0.6)]"
                : "bg-gray-400"
            }`}
            onClick={() => {
              setDirection(index > current ? 1 : -1);
              setCurrent(index);
            }}
          ></div>
        ))}
      </div>

      {/* MODAL POPUP */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div className="bg-white/10 text-white backdrop-blur-xl p-8 rounded-2xl shadow-2xl max-w-md w-[90%] relative border border-white/20">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-white text-2xl hover:text-red-400 transition"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-2">
                {eventDetails[current].title}
              </h2>
              <p className="text-gray-300 text-sm mb-1">
                📅 {eventDetails[current].date}
              </p>
              <p className="text-gray-300 text-sm mb-3">
                📍 {eventDetails[current].location}
              </p>
              <p className="text-gray-100 text-base mb-5">
                {eventDetails[current].desc}
              </p>

              <button
                onClick={closeModal}
                className="bg-blue-600 hover:bg-purple-600 transition text-white font-semibold py-2 px-6 rounded-full shadow-lg"
              >
                Confirm RSVP
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
