const nodemailer = require("nodemailer");

// FORCING IPv4 for Cloud Compatibility (Render fix)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // Using SSL Port 465
  secure: true, // Must be true for 465
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS, // 16-digit App Password
  },
  // THE CRITICAL FIX: Forces Nodemailer to use IPv4 instead of IPv6
  family: 4,
  connectionTimeout: 15000, // 15 seconds
  greetingTimeout: 15000,
  socketTimeout: 15000,
  tls: {
    rejectUnauthorized: false,
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
    console.log("Email Sent Successfully to:", to);
    return { success: true };
  } catch (error) {
    // Detailed logging for Render terminal
    console.error("NODEMAILER ERROR:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
