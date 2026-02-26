require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const bookingsRouter = require("./src/routes/bookings");
const blocksRouter = require("./src/routes/blocks");
const authRoutes = require("./src/routes/auth");                 // ✅ fixed
const passwordResetRoutes = require("./src/routes/passwordReset"); // ✅ fixed

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/bookings", bookingsRouter);
app.use("/api/blocks", blocksRouter);
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordResetRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log("Backend running on", PORT));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});