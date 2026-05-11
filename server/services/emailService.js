const nodemailer = require("nodemailer");

// 1. Create a "Cloud-Optimized" transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS, // Your 16-digit Google App Password
  },
  // THE CRITICAL FIXES FOR RENDER:
  family: 4, // FORCES IPv4 (Fixes ENETUNREACH)
  connectionTimeout: 20000, // Wait 20 seconds for slow cloud handshakes
  greetingTimeout: 20000,
  socketTimeout: 20000,
  tls: {
    rejectUnauthorized: false, // Helps bypass Render's internal proxy issues
    minVersion: "TLSv1.2",
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"HealthSync System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("SUCCESS: Email sent to:", to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // This will print the EXACT reason in Render logs
    console.error("NODEMAILER ERROR:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
