const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('ready');
    res.send(
        '<form method=post action=/send>' +
        '<input type=text name=fromName placeholder=fromName value=Test>' +
        '<input type=text name=subject placeholder=subject>' +
        '<input type=text name=body placeholder=body>' +
        '<input type=text name=replyTo placeholder=replyTo>' +
        '<input type=submit value=Send>' +
        '</form>'
    );
});

app.post('/send', (req, res) => {
    let fromName = req.body.fromName;
    if (!fromName || typeof fromName !== 'string') {
        res.status(400).send('Missing fromName');
        return;
    }
    let subject = req.body.subject;
    if (!subject || typeof subject !== 'string') {
        res.status(400).send('Missing subject');
        return;
    }
    let body = req.body.body;
    let html = req.body.html;

    let toEmail = req.body.toEmail;
    if (toEmail && (typeof toEmail !== 'string' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(toEmail))) {
        res.status(400).send('Invalid toEmail');
        return;
    }
    let replyTo = req.body.replyTo;
    let fromEmail = req.body.replyTo;

    if (replyTo && (typeof replyTo !== 'string' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(replyTo))) {
        res.status(400).send('Invalid replyTo');
        return;
    }

    fromName = fromName.substring(0, 100).replace(/[^a-zA-Z0-9\-\.\_\ ]/, '');
    subject = subject.substring(0, 200);
    body = body.substring(0, parseInt(process.env.MAX_BODY_SIZE, 10) || 10000);

        if (!fromEmail) {
            process.exit(1);
        }
        const transporter = nodemailer.createTransport({
            tls: { rejectUnauthorized: false },
            host: 'mail.domainlions.' + fromEmail.split('.')[1],
            port: parseInt(process.env.SMTP_PORT, 10) || 465,
            secure: true,
            auth: {
                user: fromEmail,
                pass: process.env.SMTP_PASSWORD
            }
        });
        const mailOptions = {
            from: '"' + fromName + '" <' + fromEmail + '>',
            to: toEmail,
            subject: subject,
            text: body,
            html: html,
            replyTo: replyTo
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).send(err.message);
                return;
            }
            console.log('Message sent from '
                + fromEmail + ' to ' + toEmail +
                '  :', info.messageId, info.response);
            res.send('sent');
        });
    // }

});

const server = app.listen(app.get('port'), () => {
    const port = server.address().port;
    console.log('Server running at https://localhost:' + port);
});
