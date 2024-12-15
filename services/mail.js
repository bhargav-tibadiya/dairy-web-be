const nodemailer = require('nodemailer');

const mailSender = async (recipientEmail, subject, body) => {
  try {
    // Configure the transport
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: "Dairy Web || Bhargav Tibadiya",
      to: recipientEmail,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${recipientEmail}:`, info.messageId);
    return info;

  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

module.exports = mailSender;

module.exports = mailSender;