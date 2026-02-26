const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

function makeOtp() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

// ✅ Dev SMS sender (prints OTP in backend console)
// Later: replace with MSG91/Twilio etc.
async function sendOtpSms(phone, otp) {
  const authkey = process.env.MSG91_AUTHKEY;
  const sender = process.env.MSG91_SENDER || "SMSIND";
  if (!authkey) {
    console.log(`[DEV OTP] Phone: ${phone} OTP: ${otp} (MSG91_AUTHKEY missing)`);
    return;
  }

  const message = `Your OTP for password reset is ${otp}`;

  const url =
    "http://api.msg91.com/api/sendotp.php?" +
    new URLSearchParams({
      authkey,
      mobile: String(phone),
      message,
      sender,
      otp: String(otp),
      otp_expiry: "5",
    }).toString();

  const r = await fetch(url); // Node 18+ has fetch
  const txt = await r.text();
  if (!r.ok) {
    console.log("MSG91 error:", txt);
    throw new Error("MSG91 send failed");
  }
}

// Step 1: Request OTP
router.post("/request-otp", async (req, res) => {
  try {
    const { phone } = req.body || {};
    if (!phone) return res.status(400).json({ error: "Phone required" });

    const user = await User.findOne({ phone: String(phone).trim() });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = makeOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    user.resetOtpHash = otpHash;
    user.resetOtpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save();

    await sendOtpSms(user.phone, otp);

    // Don’t return otp in production. (Dev only printed in console)
    return res.json({ ok: true, message: "OTP sent" });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

// Step 2: Verify OTP + set new password
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body || {};
    if (!phone || !otp || !newPassword) {
      return res.status(400).json({ error: "Phone, OTP and newPassword required" });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: "Password must be 6+ characters" });
    }

    const user = await User.findOne({ phone: String(phone).trim() });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
      return res.status(400).json({ error: "OTP not requested" });
    }

    if (new Date() > user.resetOtpExpiresAt) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const ok = await bcrypt.compare(String(otp), user.resetOtpHash);
    if (!ok) return res.status(401).json({ error: "Invalid OTP" });

    user.passwordHash = await bcrypt.hash(String(newPassword), 10);
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;
    await user.save();

    return res.json({ ok: true, message: "Password updated" });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;