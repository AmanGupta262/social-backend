
const nodemailer = require('nodemailer');
require('dotenv').config();


let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USERNAME,
        pass: process.env.PASSWORD
    }
});


module.exports = transporter;