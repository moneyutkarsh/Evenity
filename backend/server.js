// Load environment variables FIRST
require("dotenv").config();

const express = require("express");
const colors = require("colors");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport"); // ⭐ IMPORTANT

// DB connection
const connectDB = require("./config/db");

// Error middleware
const { errorHandler } = require("./middleware/errorMiddleware");

// Routes
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// ⭐ Connect to MongoDB
connectDB();

// ⭐ Init Express app
const app = express();

// ⭐ CORS Setup
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// ⭐ Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ Sessions (needed for LinkedIn + Apple)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// ⭐ Initialize Passport (CRITICAL)
app.use(passport.initialize());

// ⭐ All API Routes
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// ⭐ Error Handler
app.use(errorHandler);

// ⭐ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`.cyan.bold)
);
