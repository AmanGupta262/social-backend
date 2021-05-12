const express = require('express');
const port = process.env.PORT || 8000;

const app = express();

const db = require('./config/mongoose');

const passport = require('passport');
const JWTStrategy = require('./config/passport-jwt-strategy');
const googleStrategy = require('./config/passport-google-oauth2-strategy');


app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.use(passport.initialize());

app.use('/', require('./routes'));

app.listen(port, (err) => {
    if(err) {console.log("Error in starting server ", err); return; }
    console.log("Server is running on port: ", port);
});