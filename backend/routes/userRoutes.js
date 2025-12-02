const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword, // ✅ added controller for forgot password
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware"); // ✅ fixed capitalization (ensure your filename matches)

// ✅ ROUTES
router.post("/", registerUser); // Signup
router.post("/login", loginUser); // Login
router.post("/forgot-password", forgotPassword); // Forgot Password
router.get("/me", protect, getMe); // Get logged-in user data

module.exports = router;
