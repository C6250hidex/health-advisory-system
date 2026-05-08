const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../services/emailService");

// 1. REGISTER: Handles Patient/Doctor, generates Verification Token, and sends Email
exports.register = async (req, res) => {
  const { name, email, password, role, license, specialization } = req.body;

  try {
    // Check if user already exists
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate Verification Token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Initial Verification Status:
    // Everyone starts as 0 (unverified) because they must confirm their email first.
    const isVerified = 0;

    // Save user to users table
    const [newUser] = await db.execute(
      "INSERT INTO users (name, email, password, role, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        hashedPassword,
        role || "user",
        isVerified,
        verificationToken,
      ],
    );

    // If it's a doctor, create their professional profile in the doctors table
    if (role === "doctor") {
      await db.execute(
        "INSERT INTO doctors (name, specialization, user_id) VALUES (?, ?, ?)",
        [name, specialization || "General Physician", newUser.insertId],
      );
    }

    // Send Verification Email
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const emailText = `Hello ${name},\n\nThank you for joining HealthSync. Please click the link below to verify your email address and activate your account:\n\n${verifyLink}\n\nIf you did not create this account, please ignore this email.`;

    await sendEmail(email, "Verify Your HealthSync Account", emailText);

    res.status(201).json({
      message:
        "Registration successful! Please check your email to verify your account before logging in.",
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// 2. LOGIN: Validates credentials and returns JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const user = users[0];

    // Check if Email is verified
    if (user.is_verified === 0 && user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. FORGOT PASSWORD: Generates Reset Token and sends Email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000); // 1 hour expiry

  try {
    const [user] = await db.execute("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0)
      return res.status(404).json({ message: "User not found" });

    await db.execute(
      "UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?",
      [token, expires, email],
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    const emailText = `You requested a password reset. Please click the link below to set a new password. This link is valid for 1 hour:\n\n${resetLink}`;

    await sendEmail(email, "Password Reset Request", emailText);

    res.json({ message: "Reset link sent to your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. VERIFY EMAIL: Route that activates the account
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const [user] = await db.execute(
      "SELECT id FROM users WHERE verification_token = ?",
      [token],
    );
    if (user.length === 0)
      return res.status(400).json({ message: "Invalid or expired token." });

    await db.execute(
      "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
      [user[0].id],
    );
    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
