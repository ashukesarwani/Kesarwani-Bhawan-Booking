const express = require("express");
const Booking = require("../models/Booking");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

/* ---------------- ROOM CAPACITY ---------------- */

const ROOM_CAPACITY = {
  "Standard Room": 5,
  "Deluxe Room": 3,
  "Family Room": 2,
};

/* ---------------- CREATE BOOKING (LOGIN REQUIRED) ---------------- */

router.post("/", requireAuth, async (req, res) => {
  try {
    const { room, checkin, checkout } = req.body;

    if (!room || !checkin || !checkout) {
      return res.status(400).json({ error: "Missing booking fields" });
    }

    const ci = new Date(checkin);
    const co = new Date(checkout);

    const capacity = ROOM_CAPACITY[room] ?? 0;
    if (capacity === 0) {
      return res.status(400).json({ error: "Invalid room type" });
    }

    // Count overlapping bookings
    const overlapCount = await Booking.countDocuments({
      room,
      status: { $in: ["pending", "confirmed"] },
      checkin: { $lt: co },
      checkout: { $gt: ci },
    });

    if (overlapCount >= capacity) {
      return res
        .status(409)
        .json({ error: "No rooms available for selected dates" });
    }

    const booking = await Booking.create({
      ...req.body,
      status: "pending",
      userId: req.user.uid,
    });

    return res.json(booking);

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- ADMIN: LIST BOOKINGS ---------------- */

router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { status } = req.query;
  const q = status ? { status } : {};
  const bookings = await Booking.find(q)
    .sort({ createdAt: -1 })
    .lean();

  res.json(bookings);
});

/* ---------------- ADMIN: UPDATE STATUS ---------------- */

router.patch(
  "/:id/status",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updated);
  }
);

module.exports = router;