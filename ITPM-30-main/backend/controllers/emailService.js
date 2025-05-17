// controllers/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS  // Your email password or app password from .env
  }
});

// Function to send email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

module.exports = {
  sendEmail
};