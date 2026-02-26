const express = require("express");
const BlockedDate = require("../models/BlockedDate");
const { adminAuth } = require("../middleware/adminAuth");

const router = express.Router();

// Public: blocked dates list
router.get("/", async (req, res) => {
  const blocks = await BlockedDate.find().sort({ date: 1 }).lean();
  res.json(blocks);
});

// Admin: block a date
router.post("/", adminAuth, async (req, res) => {
  const { date, reason = "" } = req.body;
  if (!date) return res.status(400).json({ error: "date required" });

  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const created = await BlockedDate.findOneAndUpdate(
    { date: d },
    { date: d, reason },
    { upsert: true, new: true }
  );

  res.json(created);
});

// Admin: unblock
router.delete("/:id", adminAuth, async (req, res) => {
  await BlockedDate.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;