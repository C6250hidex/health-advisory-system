const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authorize = require("../middleware/authMiddleware");
const sendEmail = require("../services/emailService"); // Added for notifications

/**
 * ---------------------------------------------------------
 * 1. PUBLIC ROUTES
 * ---------------------------------------------------------
 */

// Get all posts for the Blog page
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute(`
        SELECT p.*, u.name as author_name, u.role as author_role 
        FROM posts p 
        JOIN users u ON p.author_id = u.id 
        ORDER BY p.created_at DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * 2. PROTECTED MANAGEMENT ROUTES (Admin & Doctor)
 * ---------------------------------------------------------
 */

// Get posts for current user (Doctor seeing their own list)
router.get("/my-posts", authorize(["admin", "doctor"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC",
      [req.user.id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE POST & NOTIFY ALL USERS
router.post("/", authorize(["admin", "doctor"]), async (req, res) => {
  const { title, content, excerpt, category, read_time } = req.body;
  try {
    // 1. Insert the post into the database
    await db.execute(
      "INSERT INTO posts (title, content, excerpt, category, author_id, read_time) VALUES (?, ?, ?, ?, ?, ?)",
      [
        title,
        content,
        excerpt || null,
        category,
        req.user.id,
        read_time || "5 min",
      ],
    );

    // 2. Fetch all verified users to notify them
    const [users] = await db.execute(
      "SELECT email, name FROM users WHERE is_verified = 1",
    );

    // 3. Loop through users and send emails
    users.forEach((u) => {
      sendEmail(
        u.email,
        "New Health Tip Published!",
        `Hello ${u.name},\n\nA new medical article titled "${title}" has just been published by our experts. Log in to HealthSync to read the full tip!\n\nStay healthy!`,
      );
    });

    res
      .status(201)
      .json({ message: "Health tip published and users notified!" });
  } catch (err) {
    console.error("Post Creation Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update an existing post
router.put("/:id", authorize(["admin", "doctor"]), async (req, res) => {
  const { title, content, category } = req.body;
  const { id } = req.params; // Make sure this is capturing the ID from the URL

  try {
    // 1. Check if post exists
    const [post] = await db.execute(
      "SELECT author_id FROM posts WHERE id = ?",
      [id],
    );
    if (post.length === 0)
      return res.status(404).json({ message: "Post not found" });

    // 2. Permission check
    if (req.user.role !== "admin" && post[0].author_id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 3. Update
    await db.execute(
      "UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ?",
      [title, content, category, id],
    );

    res.json({ message: "Post updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
router.delete("/:id", authorize(["admin", "doctor"]), async (req, res) => {
  try {
    const [post] = await db.execute(
      "SELECT author_id FROM posts WHERE id = ?",
      [req.params.id],
    );

    if (post.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.user.role !== "admin" && post[0].author_id !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized: You can only delete your own articles.",
      });
    }

    await db.execute("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: "Post deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
