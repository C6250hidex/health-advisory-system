const nodemailer = require("nodemailer");
require("dotenv").config();

// Initialize Nodemailer with your email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailoptions = {
      from: `HealthSync <${process.env.EMAIL_USER}>`,
      to: [to],
      subject: subject,
      text: text,
    };
    const info = await transporter.sendMail(mailoptions);

    console.log("EMAIL SUCCESS:", info.messageId);
    return {
      success: true,
      id: info.messageId,
    };
  } catch (error) {
    console.error("EMAIL ERROR:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
