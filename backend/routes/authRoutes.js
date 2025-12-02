const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
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
   ⭐ GOOGLE AUTH FLOW
======================================================*/

/* STEP 1 — Redirect to Google */
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/* STEP 2 — Google OAuth Callback (NO auto-creation) */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const googleUser = req.user; // from passport.js

      if (!googleUser?.email) {
        console.error("Google profile missing email");
        return res.redirect(`${FRONTEND_URL}/login`);
      }

      // Check if a user with this email already exists
      let existingUser = await User.findOne({ email: googleUser.email });

      if (existingUser) {
        // If user exists but has no googleId yet, attach it
        if (!existingUser.googleId && googleUser.googleId) {
          existingUser.googleId = googleUser.googleId;
          await existingUser.save();
        }

        const token = generateToken(existingUser);
        return res.redirect(
          `${FRONTEND_URL}/auth/callback?token=${token}`
        );
      }

      // ⭐ NEW USER → send them to complete-signup with googleId also
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

/* STEP 3 — Google Complete Signup */
router.post("/google/complete-signup", async (req, res) => {
  try {
    let { email, name, username, googleId } = req.body;

    if (!email || !googleId) {
      return res
        .status(400)
        .json({ message: "Email and Google ID are required" });
    }

    if (!username) {
      return res
        .status(400)
        .json({ message: "Username is required" });
    }

    username = username.trim().toLowerCase();

    // Email already existing?
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "Email already registered. Please login instead.",
      });
    }

    // Username uniqueness (only works if you add `username` field in schema)
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ message: "Username already taken. Try another." });
    }

    // Create user – NOTE: password is not required because googleId is set
    const newUser = await User.create({
      name,
      email,
      googleId,
      username, // safe even if not in schema (Mongoose will ignore)
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
router.get(
  "/linkedin",
  passport.authenticate("linkedin", { state: true })
);

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
