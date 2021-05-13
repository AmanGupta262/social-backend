const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const googleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const User = require('../models/user');

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const user = await User.findOne({ email: profile.emails[0].value });


            if (user) {
                return done(null, user);
            }
            let password = crypto.randomBytes(20).toString("hex");
            password = await bcrypt.hash(password, 10); 

            const newUser = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: password
            });
            return done(null, newUser);

        } catch (error) {
            console.log("Error: ", error);
            return res.status(500).json({
                message: "Internal Server Error",
                error
            });
        }
    }
));

