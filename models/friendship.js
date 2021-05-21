const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId;
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId;
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['0', '1', '2'],
        defaule: '0'
    }
},{
    timestamps: true
});