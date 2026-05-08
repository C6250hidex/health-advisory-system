const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // port 587 uses STARTTLS, so secure must be false
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS, // 16-digit App Password
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false, // Helps connection on cloud hosting
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"HealthSync Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email success:", info.response);
    return { success: true };
  } catch (error) {
    console.error("NODEMAILER ERROR:", error.message);
    // If it times out, we want to know why
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
