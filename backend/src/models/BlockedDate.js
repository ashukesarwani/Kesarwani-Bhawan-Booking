const mongoose = require("mongoose");

const BlockedDateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, unique: true },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlockedDate", BlockedDateSchema);