const nodemailer = require("nodemailer");

// set handlebar

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(body) {
  const { userName, userEmail, userPhone, userMessage } = body;
  const output = `<h1>Hello</h1>
    <p>
      Вы получили письмо от ${userName} с мыла ${userEmail} по телефону ${userPhone} с сообщением ${userMessage}
    </p>`;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.meta.ua",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "andy511@meta.ua", // generated ethereal user
      pass: "SantAdria3331", // generated ethereal password
    },
  });

  const emailOptions = {
    from: "andy511@meta.ua", // sender address
    to: "andy.smokk@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: userMessage, // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(emailOptions);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = sendEmail;
