const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    password: {
        type: String,
        default: 'password123',
    },
    role: {
        type: String,
        enum: ['Admin', 'Instructor', 'Student'],
        default: 'Instructor',
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
