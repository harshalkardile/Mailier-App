const sgMail = require("@sendgrid/mail");

const sendMail = (mails, subject, message, template) => {
  sgMail.setApiKey(process.env.Mail_Secret);
  const msg = {
    to: "akshayshinde0279685@gmail.com",
    bcc: mails,
    from: "sainath@plutonext.in",
    subject: subject,
    text: message,
  };

  console.log(template);

  if (template !== " ") {
    msg.html = template;
  }

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
