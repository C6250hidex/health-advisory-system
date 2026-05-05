const express = require("express");
const cors = require("cors");
require("dotenv").config();

// 1. Import Route Modules
const authRoutes = require("./routes/auth");
const adviceRoutes = require("./routes/advice");
const appointmentRoutes = require("./routes/appointments");
const postRoutes = require("./routes/posts"); // Added Blog Post Routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/advice", adviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("HealthSync Enterprise API is Running...");
});

const db = require("./config/db");

app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, email FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
