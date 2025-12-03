// ---------------------------------------------
// 🌟 Load environment variables FIRST
// ---------------------------------------------
require("dotenv").config();

const express = require("express");
const colors = require("colors");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");

// DB Connection
const connectDB = require("./config/db");

// Middleware
const { errorHandler } = require("./middleware/errorMiddleware");

// Routes
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// ---------------------------------------------
// 🌟 Start Server After DB Connection
// ---------------------------------------------
const startServer = async () => {
  try {
    await connectDB(); // ⭐ Wait for MongoDB to connect
    console.log("✅ MongoDB Connected".green.bold);

    const app = express();

    // ---------------------------------------------
    // 🌟 CORS
    // ---------------------------------------------
    app.use(
      cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
      })
    );

    // ---------------------------------------------
    // 🌟 Body Parsing
    // ---------------------------------------------
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ---------------------------------------------
    // 🌟 Sessions for OAuth (LinkedIn, Apple)
    // ---------------------------------------------
    app.use(
      session({
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false,
      })
    );

    // ---------------------------------------------
    // 🌟 Passport Auth
    // ---------------------------------------------
    app.use(passport.initialize());

    // ---------------------------------------------
    // 🌟 API Routes
    // ---------------------------------------------
    app.use("/api/events", eventRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/auth", authRoutes);

    // ---------------------------------------------
    // 🌟 Error Handling Middleware
    // ---------------------------------------------
    app.use(errorHandler);

    // ---------------------------------------------
    // 🌟 Start Backend Server
    // ---------------------------------------------
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`.cyan.bold)
    );

  } catch (error) {
    console.error("❌ Server failed to start:", error.message.red.bold);
    process.exit(1);
  }
};

// Run the server
startServer();
