var express = require('express');
var router = express.Router();

const nodemailer = require("nodemailer");

router.post('/sendFeedback', (req, res) => {

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.strato.de",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'business@evento-leipzig.de', // generated ethereal user
            pass: 'dubdaw-wasna4-riXpiw', // generated ethereal password
        },
    });

    // send mail with defined transport object
    transporter.sendMail({
        from: 'business@evento-leipzig.de', // sender address
        to: "business@evento-leipzig.de", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    }, function (err, info) {
        if (err) {
            res.send(err)
        } else {
            res.send(info);
        }
    });


});

module.exports = router;

