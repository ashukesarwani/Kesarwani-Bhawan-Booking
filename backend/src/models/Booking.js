const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    room: { type: String, required: true },
    guests: { type: Number, default: 2 },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);