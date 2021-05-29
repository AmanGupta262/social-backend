const nodemailer = require('../config/nodemailer');

exports.reset = (user) => {
    console.log("Inside forgot password mailer");
    nodemailer.transporter.sendMail({
        to: user.email,
        from: 'no-reply@social.com',
        subject: "Password Reset Request",
        html: `<h1>Hello, ${user.name}</h1> <br /> <h3>Here is your token for reseting the password: <b>${user.resetToken}</b></h3>`
    },
        (err, info) => {
            if (err) { console.log('Error in sending mail: ', err); return; }

            console.log("Message Sent");
            return;
        });
}