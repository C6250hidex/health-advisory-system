const axios = require("axios");
require("dotenv").config();

/**
 * Professional Email Service using Brevo API
 * Bypasses SMTP port blocking on Cloud Hosting (Render/Vercel)
 */
const sendEmail = async (to, subject, text) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.EMAIL_USER;

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "HealthSync Support", email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        textContent: text, // You can also use htmlContent for a better look
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );

    console.log(
      "API SUCCESS: Email sent via Brevo. ID:",
      response.data.messageId,
    );
    return { success: true };
  } catch (error) {
    // Detailed error reporting
    console.error("BREVO API ERROR:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
