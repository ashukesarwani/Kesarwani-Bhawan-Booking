const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

function sign(user) {
  return jwt.sign(
    { uid: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};

    // Validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: "Password must be 6+ characters" });
    }

    // Check email already exists
    const emailExists = await User.findOne({
      email: String(email).toLowerCase(),
    });
    if (emailExists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Check phone already exists
    const phoneExists = await User.findOne({
      phone: String(phone).trim(),
    });
    if (phoneExists) {
      return res.status(409).json({ error: "Phone already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(String(password), 10);

    // Create user
    const user = await User.create({
      name,
      email: String(email).toLowerCase(),
      phone: String(phone).trim(),
      passwordHash,
      role: "user",
    });

    return res.json({
      token: sign(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email & password required" });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    return res.json({
      token: sign(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;