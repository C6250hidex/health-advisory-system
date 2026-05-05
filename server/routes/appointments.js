const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authorize = require("../middleware/authMiddleware");
const sendEmail = require("../services/emailService");

/**
 * ---------------------------------------------------------
 * 1. GENERAL & PATIENT ROUTES
 * ---------------------------------------------------------
 */

// GET DOCTORS with Proximity Calculation (Real-Time Distance)
router.get("/doctors", authorize(), async (req, res) => {
  try {
    const [userLoc] = await db.execute(
      "SELECT latitude, longitude FROM users WHERE id = ?",
      [req.user.id],
    );

    const pLat = userLoc[0]?.latitude || 0;
    const pLng = userLoc[0]?.longitude || 0;

    let query = `
      SELECT d.*, u.latitude, u.longitude, u.phone as doctor_phone,
      (6371 * acos(cos(radians(?)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(?)) + sin(radians(?)) * sin(radians(u.latitude)))) AS distance
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.is_active = 1
      ORDER BY distance ASC`;

    const [rows] = await db.execute(query, [pLat, pLng, pLat]);
    res.json(rows);
  } catch (err) {
    console.error("Proximity Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get user's own appointments (Patient View)
router.get(
  "/my-appointments",
  authorize(["user", "doctor", "admin"]),
  async (req, res) => {
    try {
      const [rows] = await db.execute(
        `SELECT a.*, d.name as doctor_name, d.specialization 
         FROM appointments a 
         JOIN doctors d ON a.doctor_id = d.id 
         WHERE a.user_id = ? 
         ORDER BY a.appointment_date DESC`,
        [req.user.id],
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

/**
 * ---------------------------------------------------------
 * 2. DOCTOR & ADMIN MANAGEMENT ROUTES
 * ---------------------------------------------------------
 */

// DOCTOR: Get appointments assigned to ME
router.get("/doctor", authorize(["doctor"]), async (req, res) => {
  try {
    const [doc] = await db.execute("SELECT id FROM doctors WHERE user_id = ?", [
      req.user.id,
    ]);

    if (doc.length === 0) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    const [rows] = await db.execute(
      `SELECT a.*, u.name as patient_name, u.dob, u.gender, u.phone, u.email 
       FROM appointments a 
       JOIN users u ON a.user_id = u.id 
       WHERE a.doctor_id = ? 
       ORDER BY a.appointment_date ASC`,
      [doc[0].id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Get EVERY appointment in the system
router.get("/admin", authorize(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.*, u.name as patient_name, d.name as doctor_name 
       FROM appointments a 
       JOIN users u ON a.user_id = u.id 
       JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.id DESC`,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN ONLY: Monitor Chat for ANY appointment
router.get("/monitor/:id", authorize(["admin"]), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT m.*, u.name as sender_name, u.role as sender_role 
         FROM messages m 
         JOIN users u ON m.sender_id = u.id 
         WHERE m.appointment_id = ? 
         ORDER BY m.created_at ASC`,
      [req.params.id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * 3. COMMUNICATION (CHAT/MESSAGING) SYSTEM
 * ---------------------------------------------------------
 */

// POST a message/reply to an appointment
router.post("/:id/message", authorize(), async (req, res) => {
  const { message_text } = req.body;
  const appointment_id = req.params.id;

  if (!message_text) {
    return res.status(400).json({ message: "Message cannot be empty" });
  }

  try {
    const [user] = await db.execute(
      "SELECT role, name FROM users WHERE id = ?",
      [req.user.id],
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User info not found" });
    }

    await db.execute(
      "INSERT INTO messages (appointment_id, sender_id, message_text, sender_role, sender_name) VALUES (?, ?, ?, ?, ?)",
      [appointment_id, req.user.id, message_text, user[0].role, user[0].name],
    );

    res.json({ message: "Message sent successfully!" });
  } catch (err) {
    console.error("Messaging Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET all messages for a specific appointment
router.get("/:id/messages", authorize(), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT m.*, u.name as sender_name, u.role as sender_role 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.appointment_id = ? 
       ORDER BY m.created_at ASC`,
      [req.params.id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * 4. ACTION & STATUS ROUTES
 * ---------------------------------------------------------
 */

// UPDATE STATUS: With Email Notification for Approval
router.put("/:id/status", authorize(["doctor", "admin"]), async (req, res) => {
  const { status, instructions } = req.body;
  const { id } = req.params;

  try {
    await db.execute(
      "UPDATE appointments SET status = ?, instructions = ? WHERE id = ?",
      [status, instructions || null, id],
    );

    if (status === "approved") {
      const [details] = await db.execute(
        `SELECT u.email, u.name as patient_name, d.name as doctor_name
         FROM appointments a
         JOIN users u ON a.user_id = u.id
         JOIN doctors d ON a.doctor_id = d.id
         WHERE a.id = ?`,
        [id],
      );

      if (details.length > 0) {
        sendEmail(
          details[0].email,
          "Appointment Approved!",
          `Hello ${details[0].patient_name}, Dr. ${details[0].doctor_name} has approved your visit. Instructions: ${instructions || "Please check your dashboard."}`,
        );
      }
    }

    res.json({ message: `Appointment ${status} successfully!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BOOK APPOINTMENT: With Email Notification for Request
router.post(
  "/book",
  authorize(["user", "doctor", "admin"]),
  async (req, res) => {
    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    try {
      if (!doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ message: "Missing booking details." });
      }

      await db.execute(
        `INSERT INTO appointments 
         (user_id, doctor_id, appointment_date, appointment_time, reason, status) 
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [
          req.user.id,
          doctor_id,
          appointment_date,
          appointment_time,
          reason || "Checkup",
        ],
      );

      const [user] = await db.execute("SELECT email FROM users WHERE id = ?", [
        req.user.id,
      ]);
      if (user.length > 0) {
        sendEmail(
          user[0].email,
          "Appointment Request Sent",
          "Your appointment request has been received and is currently pending doctor approval.",
        );
      }

      res.status(201).json({ message: "Appointment booked successfully!" });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Slot already taken." });
      }
      res.status(500).json({ error: err.message });
    }
  },
);

// TOGGLE AVAILABILITY
router.patch("/status-toggle", authorize(["doctor"]), async (req, res) => {
  const { is_active } = req.body;
  try {
    await db.execute("UPDATE doctors SET is_active = ? WHERE user_id = ?", [
      is_active,
      req.user.id,
    ]);
    res.json({
      message: `Status updated to ${is_active ? "Online" : "Offline"}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
