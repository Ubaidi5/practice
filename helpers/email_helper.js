/**
 * Email sent methods
 */
const fs = require("fs");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

/**
 * Email template encoding method
 * @param path - path of email template
 * @param callback - callback that will return email template encoding method result.
 * @returns {Promise<void>}
 */
let readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      // console.log("Error 1.", err); // This error is usefull
      callback(err);
    } else {
      // console.log("Response 2.", html);
      callback(null, html);
    }
  });
};
/**
 * Email sent method
 * @param senderEmail - email of sender
 * @param senderPassword - password of email sender
 * @param recipientEmail - receiver of email
 * @param emailSubject - subject of email
 * @param emailTemplate - template of email
 * @param emailText - message of email
 * @param emailData - custom data of email
 * @param cb - callback that will return email sent method result.
 * @returns {Promise<void>}
 */
exports.emailDocument = function (
  senderEmail,
  senderPassword,
  recipientEmail,
  emailSubject,
  emailTemplate,
  emailText,
  emailData,
  cb = () => {}
) {
  readHTMLFile(emailTemplate, (err, html) => {
    const template = handlebars.compile(html);

    const htmlToSend = template(emailData);

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.office365.com", // Office 365 server
    //   port: 587, // secure SMTP
    //   secure: false, // false for TLS
    //   requireTLS: true,
    //   auth: {
    //     user: senderEmail,
    //     pass: senderPassword,
    //   },
    //   tls: {
    //     ciphers: "SSLv3",
    //   },
    // });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      ssl: false,
      tls: {
        rejectUnauthorized: false,
      },
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    const mailOptions = {
      from: senderEmail, // sender address
      to: recipientEmail,
      subject: emailSubject,
      text: emailText,
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("What is the error", error);
        cb(true, error);
      } else {
        cb(false, "Email sent successfully");
      }
    });
  });
};
