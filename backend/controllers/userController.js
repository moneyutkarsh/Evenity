const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../model/userModel");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Password validation function
const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      minLength && hasUppercase && hasLowercase && hasNumber && hasSpecial,
    errors: {
      minLength: !minLength
        ? "Password must be at least 8 characters long"
        : null,
      hasUppercase: !hasUppercase
        ? "Password must contain at least one uppercase letter"
        : null,
      hasLowercase: !hasLowercase
        ? "Password must contain at least one lowercase letter"
        : null,
      hasNumber: !hasNumber
        ? "Password must contain at least one number"
        : null,
      hasSpecial: !hasSpecial
        ? "Password must contain at least one special character (!@#$%^&*...)"
        : null,
    },
  };
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error("Please provide a valid email address");
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    const errorMessages = Object.values(passwordValidation.errors)
      .filter((error) => error !== null)
      .join(". ");
    res.status(400);
    throw new Error(errorMessages);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
      message: "User registered successfully",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
      message: "Login successful",
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Get current user
const getMe = asyncHandler(async (req, res) => {
  const { _id, name, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    name,
    email,
  });
});


// ✅ Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"EventLens Support" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Reset your EventLens password",
    html: `
      <h2>Password Reset Request</h2>
      <p>We received a request to reset your password.</p>
      <p>Click below to set a new password (valid for 15 minutes):</p>
      <a href="${resetLink}" 
         style="display:inline-block;padding:10px 20px;
         background:#4f46e5;color:white;border-radius:8px;text-decoration:none;">
         Reset Password
      </a>
      <p>If you didn’t request this, you can safely ignore it.</p>
      <br><p>— The EventLens Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({
    message: "📩 Reset link sent successfully. Check your email inbox.",
  });
});

// ✅ Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;
  await user.save();

  res.json({ message: "✅ Password has been reset successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword, // ✅ added for reset route
};
