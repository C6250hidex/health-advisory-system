const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authorize = require("../middleware/authMiddleware");
const { getAdvice } = require("../controllers/adviceController");

// router.get("/", getAdvice);
router.post("/", authorize(), getAdvice);

// Only Admins and Doctors can add advice
router.post("/add", authorize(["admin", "doctor"]), async (req, res) => {
  const { keywords, advice_text } = req.body;
  try {
    await db.execute(
      "INSERT INTO health_advice (keywords, advice_text) VALUES (?, ?)",
      [keywords, advice_text],
    );
    res.status(201).json({ message: "Advice added to knowledge base!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
