const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use SSL for port 465
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS, // The 16-digit code
  },
  family: 4, // CRITICAL: Forces IPv4 (Fixes Render network errors)
  connectionTimeout: 20000, // Give it 20 seconds
  greetingTimeout: 20000,
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
    console.log("Email successful:", info.response);
    return true;
  } catch (error) {
    console.error("NODEMAILER ERROR:", error.message);
    return false;
  }
};

module.exports = sendEmail;
