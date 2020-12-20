var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');

const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

module.exports = {
    sendWelcomeMail,
    sendOrderConfirmationMail,
    sendOrderReceivedMail
};



function getTransporter() {
    return nodemailer.createTransport({
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
}

function sendWelcomeMail(userName, userEmail) {
    if (userName && userEmail && userName.length && userEmail.length) {
        readHTMLFile(__dirname + '/welcome.html', function(err, html) {
            const template = handlebars.compile(html);
            const replacements = {
                username: userName
            };
            const htmlToSend = template(replacements);
            const mailOptions = {
                from: 'contact@meduse.tn',
                to: userEmail,
                subject: 'Bienvenue dans meduse.tn',
                html: htmlToSend
            };
            getTransporter().sendMail(mailOptions, (err, res) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    } else {

    }
}

function sendOrderConfirmationMail() {

}

function sendOrderReceivedMail(userName, userEmail, orderRef) {
    if (userName && userEmail && userName.length && userEmail.length) {
        readHTMLFile(__dirname + '/order-created.html', function(err, html) {
            const template = handlebars.compile(html);
            const replacements = {
                username: userName,
                orderRef: orderRef
            };
            const htmlToSend = template(replacements);
            const mailOptions = {
                from: 'contact@meduse.tn',
                to: userEmail,
                subject: '[MEDUSE.TN] Commande en cours de préparation',
                html: htmlToSend
            };
            getTransporter().sendMail(mailOptions, (err, res) => {
                if (error) {
                    console.log(error);
                    callback(error);
                }
            });
        });
    }
}
