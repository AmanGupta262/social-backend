const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        minlength: 5
    },
    password:{
        type: String,
        required: true,
        minLength: 4,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    }
},{
    timestamp: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;