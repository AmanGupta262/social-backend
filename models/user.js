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
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
        }
    ],
    resetToken: {
        type: String,
        expires: 3600
    }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;