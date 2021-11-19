var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
const notificationsService = require('../notifications/notifications.service');

const PASSWORD_RESET_EMAIL = "password.reset@meduse.tn"
const PASSWORD_RESET_EMAIL_PWD = "passwordreset23102021";
const CONTACT_MEDUSE_EMAIL = "contact@meduse.tn";

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
    sendOrderReceivedMail,
    sendNewOrderNotification,
    sendPasswordResetMail
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

function getPasswordResetEMailTransporter() {
    return nodemailer.createTransport({
        host: 'smtp.meduse.tn',
        port: '587',
        auth: {
          user: PASSWORD_RESET_EMAIL,
          pass: PASSWORD_RESET_EMAIL_PWD
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

async function sendNewOrderNotification(order) {
    if(order) {
        const notifiedUsers = await notificationsService.getAllNotifiedUsers();
        if (notifiedUsers && notifiedUsers.length) {
            const usersEmails = notifiedUsers.map((each) => each.email);
            const orderDetailsUrl = `http://admin.meduse.tn/#/dashboard/order-details/${order.id}`;
            const mailOptions = {
                from: 'contact@meduse.tn',
                subject: '[MEDUSE.TN] Nouvelle commande',
                text: '',
                html: `Une nouvelle commande a été créee, elle est accessible sur <a href="${orderDetailsUrl}"> ce lien</a>`,
                to: usersEmails
            };
            getTransporter().sendMail(mailOptions, (err, res) => {
                if (error) {
                    console.error(error);
                }
            });
        }
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
                }
            });
        });
    }
}

function sendPasswordResetMail(userName, newPassword, email) {
    readHTMLFile(__dirname + '/passwordReset.html', function(err, html) {
        const template = handlebars.compile(html);
        const replacements = {
            username: userName,
            newPassword
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
            from: PASSWORD_RESET_EMAIL,
            to: [email, CONTACT_MEDUSE_EMAIL],
            subject: 'Mot de passe MEDUSE modifié',
            html: htmlToSend
        };
        getPasswordResetEMailTransporter().sendMail(mailOptions, (err, res) => {
            if (err) {
                console.log(err);
            }
        });
    });
}
