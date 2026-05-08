const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    password: process.env.EMAIL_PASS, // your 16-digit App Password
  },
  family: 4, // FORCES IPv4 - CRITICAL for Render
  connectionTimeout: 30000,
  greetingTimeout: 30000,
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"HealthSync System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("SUCCESS: Email sent to " + to);
    return true;
  } catch (error) {
    console.error("NODEMAILER ERROR:", error.message);
    return false;
  }
};

module.exports = sendEmail;
