const sgMail = require("@sendgrid/mail");

const sendMail = (mails, subject, message, template) => {

  sgMail.setApiKey(process.env.Mail_Secret);
  const msg = {
    to: "sainathbanewar@gmail.com",
    bcc: mails,
    from: {
      email: "sainath@plutonext.in", // Use authenticated email address
      name: "Pluto", // Optional
    },
    subject: subject,
    text: message,
    // Include both plain text and HTML for better delivery
    html: template || message,
  };

  Array.isArray(mails)

  // console.log(template);


  sgMail;
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = { sendMail };
