const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        require: true,
        min: 6,
        max: 225
    },
    avatar: {
        type: String,
    },
    firstName: {
        type: String,
        max: 225,
    },
    lastName: {
        type: String,
        max: 225,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('users', userSchema);