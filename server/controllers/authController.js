const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Unified Register Logic (Patient and Doctor)
exports.register = async (req, res) => {
  // 1. Destructure 'specialization' (field) from the body
  const { name, email, password, role, license, specialization } = req.body;

  try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isVerified = role === "doctor" ? 0 : 1;

    const [newUser] = await db.execute(
      "INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user", isVerified],
    );

    // 2. If it's a doctor, save their specific Field/Specialization
    if (role === "doctor") {
      await db.execute(
        "INSERT INTO doctors (name, specialization, user_id) VALUES (?, ?, ?)",
        [
          name,
          specialization || "General Physician", // Use the field provided by the user
          newUser.insertId,
        ],
      );
    }

    res.status(201).json({
      message:
        role === "doctor"
          ? "Registration successful! Please wait for Admin approval."
          : "User registered successfully!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 2. Login Logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const user = users[0];

    // Compare the entered password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // Create a JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Send the token and user info back (including is_verified status)
    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        is_verified: user.is_verified, // Added this so React can see it
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
