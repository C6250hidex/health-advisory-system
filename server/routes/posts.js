const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authorize = require("../middleware/authMiddleware");

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
// NOTE: Placed before /:id to prevent route collision
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

// Create a new post
router.post("/", authorize(["admin", "doctor"]), async (req, res) => {
  const { title, content, excerpt, category, read_time } = req.body;
  try {
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
    res.status(201).json({ message: "Health tip published successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an existing post
router.put("/:id", authorize(["admin", "doctor"]), async (req, res) => {
  const { title, content, category } = req.body;
  try {
    // 1. Check if post exists and get author_id
    const [post] = await db.execute(
      "SELECT author_id FROM posts WHERE id = ?",
      [req.params.id],
    );

    if (post.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2. Logic: Admin can edit anything, Doctor can only edit their OWN post
    if (req.user.role !== "admin" && post[0].author_id !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: You can only edit your own articles.",
        });
    }

    // 3. Perform update
    await db.execute(
      "UPDATE posts SET title = ?, content = ?, category = ? WHERE id = ?",
      [title, content, category, req.params.id],
    );

    res.json({ message: "Post updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
router.delete("/:id", authorize(["admin", "doctor"]), async (req, res) => {
  try {
    // 1. Check if post exists
    const [post] = await db.execute(
      "SELECT author_id FROM posts WHERE id = ?",
      [req.params.id],
    );

    if (post.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 2. Logic: Admin can delete anything, Doctor can only delete their OWN post
    if (req.user.role !== "admin" && post[0].author_id !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: You can only delete your own articles.",
        });
    }

    // 3. Perform deletion
    await db.execute("DELETE FROM posts WHERE id = ?", [req.params.id]);
    res.json({ message: "Post deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
