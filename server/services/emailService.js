const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS, // Your 16-digit Google App Password
  },
  family: 4, // FORCES IPv4 to prevent Render timeouts
  connectionTimeout: 15000,
  greetingTimeout: 15000,
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
    console.log("Verification email sent to: " + to);
    return true;
  } catch (error) {
    console.error("NODEMAILER ERROR:", error.message);
    return false;
  }
};

module.exports = sendEmail;
