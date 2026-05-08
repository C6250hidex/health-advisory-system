const nodemailer = require("nodemailer");

// Professional SMTP configuration for Cloud Hosting
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Must be false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS, // Your 16-digit App Password
  },
  tls: {
    // This helps bypass some network restrictions on Render
    rejectUnauthorized: false,
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
    console.log("Email sent successfully to:", to);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    // This will now show the exact error in Render logs
    console.error("NODEMAILER ERROR:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
