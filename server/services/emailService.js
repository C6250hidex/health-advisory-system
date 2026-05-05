const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: `"HealthSync System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log("Email Error:", error);
    else console.log("Email Sent:", info.response);
  });
};

module.exports = sendEmail;
