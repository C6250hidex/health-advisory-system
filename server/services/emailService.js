const { Resend } = require("resend");
require("dotenv").config();

// Initialize Resend with the API Key from your .env
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const data = await resend.emails.send({
      // NOTE: On the free tier, you MUST use 'onboarding@resend.dev'
      // and you can only send emails to YOUR OWN registered email
      // unless you verify a domain.
      from: `HealthSync <onboarding@resend.dev>`,
      to: [to],
      subject: subject,
      text: text,
    });

    console.log("RESEND API SUCCESS:", data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error("RESEND API ERROR:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;
