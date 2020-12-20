const express = require('express');
const router = express.Router();
const Role = require('helpers/role');
const utils = require('utils');
const nodemailer = require("nodemailer");

router.post('/' ,sendMail);

function getHtmlMessage(senderName, message) {
    let html = `<h3> Bonjour, <br/> <b>${senderName}</b> vous a envoyé un message depuis le formulaire de contact de meduse.tn. <br/> <h3/>`;
    html += `<br/>`;
    html += `<h3>Contenu du message: <br/></h3>` ;
    html += `<h4>${message}</h4>`; 

    return html;
}

function sendMail(req, res, next) {
    const form = req.body;
    doSendMail(form).then((response) => {
        res.json(response);
    })
    .catch(err => next(err));
}

async function doSendMail(form) {
    const senderName = form.senderName;
    const senderEmail = form.senderEmail;
    const message = form.message;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.meduse.tn',
    port: '587',
    auth: {
      user: 'contact.form@meduse.tn',
      pass: 'contactmeduse12122020'
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: senderEmail, // sender address
    to: 'contact@meduse.tn', // list of receivers
    subject: "Message du formulaire de contact", // Subject line
    text: '', // plain text body
    html: getHtmlMessage(senderName, message) // html body
  });

  console.log("Message sent: %s", info.messageId);
  return true;
}

module.exports = router;