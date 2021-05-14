const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User  = require('../models/user');

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'secret',
};

passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload._id);
        if(user)
        return done(null, user);

        return done(null, false);
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error
        });
    }
}));

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (err) {
            console.log("Error in finding user in passport");
            return done(err);
        }
        return done(null, user);
    });

});

passport.checkAuthenticated = (req, res, next) => {
    // if user is signed in, then pass on the req to next action
    if (req.isAuthenticated()) {
        return next();
    }

    // if user is not signed in
    return res.status(401).json({
        message: "Unauthorized"
    });
};

module.exports = passport;