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
        const user = User.findById(jwtPayload._id);
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