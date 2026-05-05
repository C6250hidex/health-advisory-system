const db = require("../config/db");

// 1. Get all doctors (so user can choose one)
exports.getDoctors = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM doctors");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Book an appointment
exports.bookAppointment = async (req, res) => {
  const { doctor_id, appointment_date, appointment_time } = req.body;
  const user_id = req.user.id; // Taken from the JWT token

  try {
    await db.execute(
      "INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time) VALUES (?, ?, ?, ?)",
      [user_id, doctor_id, appointment_date, appointment_time],
    );
    res.status(201).json({ message: "Appointment booked successfully!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "This slot is already booked for this doctor." });
    }
    res.status(500).json({ error: err.message });
  }
};

// 3. Get appointments for the logged-in user
exports.getUserAppointments = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [rows] = await db.execute(
      `SELECT a.*, d.name as doctor_name, d.specialization 
             FROM appointments a 
             JOIN doctors d ON a.doctor_id = d.id 
             WHERE a.user_id = ?`,
      [user_id],
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
