// const sgMail = require("@sendgrid/mail");

// const sendMail = (mails, subject, message, template) => {

//   sgMail.setApiKey(process.env.Mail_Secret);
//   const msg = {
//     to: "sainathbanewar@gmail.com",
//     bcc: mails,
//     from: {
//       email: "sainath@plutonext.in", // Use authenticated email address
//       name: "Pluto", // Optional
//     },
//     subject: subject,
//     text: message,
//     // Include both plain text and HTML for better delivery
//     html: template || message,
//   };

//   Array.isArray(mails)

//   // console.log(template);


//   sgMail;
//   sgMail
//     .send(msg)
//     .then(() => {
//       console.log("Email sent");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// module.exports = { sendMail };



const nodemailer = require('nodemailer');

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendMail = async (emails, subject, message, template) => {
  try {
    // Create transporter
    const transporter = createTransporter();

    // Prepare email options
    const mailOptions = {
      from: {
        name: 'Pluto',
        address: process.env.EMAIL_USER
      },
      to: emails,
      subject: subject,
      text: message,
      html: template || message
    };

    // Send email
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
module.exports = { sendMail };