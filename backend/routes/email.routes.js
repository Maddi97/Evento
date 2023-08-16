account = require('../config/mail.account.ts')

var express = require('express');
var router = express.Router();

const nodemailer = require("nodemailer");
const limiter = require("../middleware/rateLimiter")

router.post('/sendFeedback', limiter, (req, res) => {

    const feedback = req.body
    const messageText = `Name: ${feedback.name} \n`
        + `Mail: ${feedback.mail} \n`
        + `Anliegen: ${feedback.reason} \n`
        + `Beschreibung: ${feedback.description} \n`

    const messageHTML = `<ul>
                            <li> Name: ${feedback.name} </li>
                            <li> Mail: ${feedback.mail} </li>
                            <li> Anliegen: ${feedback.reason} </li>
                            <li> Beschreibung: ${feedback.description} </li>
                        </ul>`

    //  SMTP service account
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.strato.de",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: account.mailUser,
            pass: account.password,
        },
    });

    // send mail with defined transport object
    transporter.sendMail({
        from: 'business@evento-leipzig.de', // sender address
        to: "business@evento-leipzig.de", // list of receivers
        subject: `FEEDBACK: ${feedback.reason}`, // Subject line
        text: messageText, // plain text body
        html: messageHTML, // html body
    }, function (err, info) {
        if (err) {
            res.send(err)
        } else {
            res.send(info);
        }
    });


});


router.post('/sendEvent', limiter, (req, res) => {

    const event = req.body
    const messageText = `Name: ${event.name} \n`
        + `Organizer: ${event.organizerName} \n`
        + `Adresse: ${event.adress} \n`
        + `Link: ${event.link} \n`
        + `Beschreibung: ${event.description}`

    const messageHTML =
        `<ul>
            <li> Name: ${event.name} </li>
            <li> Organizer: ${event.organizerName} </li>
            <li> Adresse: ${event.adress} </li>
            <li> Link: ${event.link} </li>
            <li> Beschreibung: ${event.description} </li>
        </ul>`

    //  SMTP service account
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.strato.de",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: account.mailUser,
            pass: account.password,
        },
    });

    // send mail with defined transport object
    transporter.sendMail({
        from: 'business@evento-leipzig.de', // sender address
        to: "business@evento-leipzig.de", // list of receivers
        subject: `EVENT: ${event.name}`, // Subject line
        text: messageText, // plain text body
        html: messageHTML, // html body
    }, function (err, info) {
        if (err) {
            res.status(400).send({
                message: 'Error while Sending'
            })
        } else {
            res.send(info);
        }
    });


});


module.exports = router;

