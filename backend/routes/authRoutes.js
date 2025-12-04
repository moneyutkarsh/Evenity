const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");

/* -----------------------------------------------------
   🔐 Generate JWT Token
------------------------------------------------------*/
const generateToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

/* -----------------------------------------------------
   🌍 Frontend URL
------------------------------------------------------*/
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:3000";

/* =====================================================
   ⭐ EMAIL + PASSWORD SIGNUP
======================================================*/
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser);

    return res.json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

/* =====================================================
   ⭐ EMAIL + PASSWORD LOGIN
======================================================*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/* =====================================================
   ⭐ GOOGLE AUTH
======================================================*/

// STEP 1 — Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// STEP 2 — Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const googleUser = req.user;

      if (!googleUser?.email) {
        console.error("Google profile missing email");
        return res.redirect(`${FRONTEND_URL}/login`);
      }

      // Check if user exists
      let existingUser = await User.findOne({ email: googleUser.email });

      if (existingUser) {
        // Add googleId if missing
        if (!existingUser.googleId && googleUser.googleId) {
          existingUser.googleId = googleUser.googleId;
          await existingUser.save();
        }

        const token = generateToken(existingUser);
        return res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
      }

      // New user → send data to complete-signup page
      const redirectUrl = `${FRONTEND_URL}/complete-signup?email=${encodeURIComponent(
        googleUser.email
      )}&name=${encodeURIComponent(
        googleUser.name || ""
      )}&googleId=${encodeURIComponent(googleUser.googleId || "")}`;

      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("Google OAuth Callback Error:", err);
      return res.redirect(`${FRONTEND_URL}/login`);
    }
  }
);

// STEP 3 — Google Complete Signup
router.post("/google/complete-signup", async (req, res) => {
  try {
    let { email, name, username, googleId } = req.body;

    if (!email || !googleId) {
      return res
        .status(400)
        .json({ message: "Email and Google ID are required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    username = username.trim().toLowerCase();

    // Email already used?
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(400)
        .json({ message: "Email already registered. Please login." });
    }

    // Unique username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "Username already taken. Try another." });
    }

    // Create user
    const newUser = await User.create({
      name,
      email,
      googleId,
      username,
    });

    const token = generateToken(newUser);

    return res.json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (err) {
    console.error("Complete Signup Error:", err);
    res.status(500).json({ message: "Error completing signup" });
  }
});

/* =====================================================
   ⭐ GITHUB AUTH
======================================================*/
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    const user = req.user;
    const token = generateToken(user);

    return res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

/* =====================================================
   ⭐ LINKEDIN AUTH
======================================================*/
router.get("/linkedin", passport.authenticate("linkedin", { state: true }));

router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", { session: false }),
  async (req, res) => {
    const user = req.user;
    const token = generateToken(user);

    return res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
