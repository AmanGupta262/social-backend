const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/social', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', console.error.bind('Error in connecting mongodb'));

db.once('open', () => console.log('Connected to database: MongoDB'));

module.exports = db;