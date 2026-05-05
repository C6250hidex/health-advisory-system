const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authorize = require("../middleware/authMiddleware");

// 1. PUBLIC: Get all posts
router.get("/", async (req, res) => {
  const [rows] = await db.execute(`
        SELECT p.*, u.name as author_name, u.role as author_role 
        FROM posts p 
        JOIN users u ON p.author_id = u.id 
        ORDER BY p.created_at DESC`);
  res.json(rows);
});

// 2. PROTECTED: Create a post (Admin and Doctor only)
router.post("/", authorize(["admin", "doctor"]), async (req, res) => {
  const { title, content, excerpt, category, read_time } = req.body;
  try {
    await db.execute(
      "INSERT INTO posts (title, content, excerpt, category, author_id, read_time) VALUES (?, ?, ?, ?, ?, ?)",
      [title, content, excerpt, category, req.user.id, read_time],
    );
    res.status(201).json({ message: "Health tip published successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
