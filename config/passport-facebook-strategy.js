const passport = require('passport');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const facebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

const User = require('../models/user');

passport.use(new facebookStrategy(
    {
        clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
        callbackURL: process.env.FACEBOOK_OAUTH_CALLBACK_URL,
        profileFields: ['id', 'email', 'displayName']
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
    })
);


module.exports = passport;