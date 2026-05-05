const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authorize = require("../middleware/authMiddleware");
const db = require("../config/db");

/**
 * ---------------------------------------------------------
 * 1. PUBLIC ROUTES (No Token Needed)
 * ---------------------------------------------------------
 */
router.post("/register", register);
router.post("/login", login);

/**
 * ---------------------------------------------------------
 * 2. USER PROFILE ROUTES (Any Logged-in User)
 * ---------------------------------------------------------
 */

// Get Personal Profile Data
router.get("/profile", authorize(), async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, phone, dob, gender, role, is_verified, latitude, longitude FROM users WHERE id = ?",
      [req.user.id],
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    // If doctor, fetch their bio and clinic address too
    let userData = rows[0];
    if (userData.role === "doctor") {
      const [docRows] = await db.execute(
        "SELECT bio, clinic_address FROM doctors WHERE user_id = ?",
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

// Update Personal/Professional Profile Data (Enhanced Version)
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
    // 1. Update the primary Users table (Basic info + GPS)
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

    // 2. If the user is a doctor, we also update the professional details in the doctors table
    if (req.user.role === "doctor") {
      await db.execute(
        "UPDATE doctors SET bio = ?,phone = ?, clinic_address = ?, experience_years = ? WHERE user_id = ?",
        [
          bio || null,
          phone || null,
          clinic_address || null,
          experience_years || null,
          req.user.id,
        ],
      );
    }

    res.json({ message: "Profile updated successfully!" });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * 3. ADMIN ONLY ROUTES (Full Control)
 * ---------------------------------------------------------
 */

// Get All Users (Patients & Doctors)
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

// Verify a Doctor
router.put("/verify-doctor/:id", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("UPDATE users SET is_verified = 1 WHERE id = ?", [id]);

    // Log the verification
    await db.execute(
      "INSERT INTO audit_logs (action_type, performed_by, details) VALUES (?, ?, ?)",
      ["DOCTOR_VERIFIED", req.user.id, `Admin verified doctor user ID: ${id}`],
    );

    res.json({ message: "Doctor verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Specific User
router.delete("/users/:id", authorize(["admin"]), async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get System Audit Logs
router.get("/logs", authorize(["admin"]), async (req, res) => {
  try {
    const [manualLogs] = await db.execute(`
              SELECT l.*, u.name as admin_name 
              FROM audit_logs l 
              LEFT JOIN users u ON l.performed_by = u.id 
              ORDER BY l.created_at DESC LIMIT 50`);

    res.json(manualLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear All System Data (Except Admin)
router.delete("/purge-all", authorize(["admin"]), async (req, res) => {
  try {
    await db.execute("DELETE FROM users WHERE role != 'admin'");

    await db.execute(
      "INSERT INTO audit_logs (action_type, performed_by, details) VALUES (?, ?, ?)",
      ["SYSTEM_PURGE", req.user.id, "Admin performed a complete system reset"],
    );

    res.json({
      message: "System purged successfully. All users and data cleared.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
