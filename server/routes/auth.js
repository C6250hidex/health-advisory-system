const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authorize = require("../middleware/authMiddleware");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

/**
 * ---------------------------------------------------------
 * 1. PUBLIC AUTH ROUTES
 * ---------------------------------------------------------
 */
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);

// Password Reset Logic (Handles the actual password change)
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update password only if token matches and hasn't expired
    const [result] = await db.execute(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ? AND reset_expires > NOW()",
      [hashedPassword, token],
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset link." });
    }

    res.json({ message: "Password updated successfully! You can now log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * 2. USER PROFILE ROUTES (Self Management)
 * ---------------------------------------------------------
 */

// Get Personal Profile (Merges User + Doctor data if applicable)
router.get("/profile", authorize(), async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, phone, dob, gender, role, is_verified, latitude, longitude FROM users WHERE id = ?",
      [req.user.id],
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    let userData = rows[0];

    // If the user is a doctor, join their bio and clinic info
    if (userData.role === "doctor") {
      const [docRows] = await db.execute(
        "SELECT bio, clinic_address, experience_years FROM doctors WHERE user_id = ?",
        [req.user.id],
      );
      if (docRows.length > 0) {
        userData = { ...userData, ...docRows[0] };
      }
    }

    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile (Handles GPS, Phone, Bio, and Experience)
router.put("/profile", authorize(), async (req, res) => {
  const {
    phone,
    dob,
    gender,
    latitude,
    longitude,
    bio,
    clinic_address,
    experience_years,
  } = req.body;
  try {
    // 1. Update the primary Users table
    await db.execute(
      `UPDATE users SET phone = ?, dob = ?, gender = ?, 
       latitude = ?, longitude = ? WHERE id = ?`,
      [
        phone || null,
        dob || null,
        gender || null,
        latitude || null,
        longitude || null,
        req.user.id,
      ],
    );

    // 2. If the user is a doctor, update the professional details in the doctors table
    if (req.user.role === "doctor") {
      await db.execute(
        "UPDATE doctors SET bio = ?, clinic_address = ?, experience_years = ? WHERE user_id = ?",
        [
          bio || null,
          clinic_address || null,
          experience_years || null,
          req.user.id,
        ],
      );
    }

    res.json({ message: "Medical profile updated successfully!" });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * 3. ADMIN MANAGEMENT ROUTES
 * ---------------------------------------------------------
 */

// View all users
router.get("/users", authorize(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, role, is_verified, phone, dob, gender, latitude, longitude FROM users",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Doctor + Log action
router.put("/verify-doctor/:id", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("UPDATE users SET is_verified = 1 WHERE id = ?", [id]);

    // Auto-log the action
    await db.execute(
      "INSERT INTO audit_logs (action_type, performed_by, details) VALUES (?, ?, ?)",
      ["DOCTOR_VERIFIED", req.user.id, `Admin verified doctor user ID: ${id}`],
    );

    res.json({ message: "Doctor verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete User
router.delete("/users/:id", authorize(["admin"]), async (req, res) => {
  try {
    await db.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User removed from system." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// System Logs
router.get("/logs", authorize(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute(`
        SELECT l.*, u.name as admin_name 
        FROM audit_logs l 
        LEFT JOIN users u ON l.performed_by = u.id 
        ORDER BY l.created_at DESC LIMIT 50`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// System Purge
router.delete("/purge-all", authorize(["admin"]), async (req, res) => {
  try {
    await db.execute("DELETE FROM users WHERE role != 'admin'");
    await db.execute(
      "INSERT INTO audit_logs (action_type, performed_by, details) VALUES (?, ?, ?)",
      ["SYSTEM_PURGE", req.user.id, "Admin performed a complete system reset"],
    );
    res.json({ message: "System purged successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
