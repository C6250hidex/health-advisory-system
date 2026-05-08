const { Resend } = require("resend");
require("dotenv").config();

// Initialize Resend with your API Key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const data = await resend.emails.send({
      // Note: On the free tier, you must send FROM 'onboarding@resend.dev'
      // unless you verify a custom domain.
      from: "HealthSync <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      text: text,
    });

    console.log("Email API Success:", data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("EMAIL API ERROR:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
