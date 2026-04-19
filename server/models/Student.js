const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
    },
    department: {
        type: String,
        required: [true, 'Please add a department'],
        default: 'General'
    },
    phoneNumber: {
        type: String,
        default: '',
    },
    password: {
        type: String,
        // Password is now explicitly generated and hashed in the controller before save
    },
    profilePic: {
        type: String,
        default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    gpa: {
        type: Number,
        default: 0.0,
    },
    attendance: {
        type: Number, // Percentage
        default: 0,
    },
    marks: {
        type: Map,
        of: Number, // Subject: Marks
        default: {},
    },
    isAtRisk: {
        type: Boolean,
        default: false,
    },
    resume_score: {
        type: Number,
        default: 0,
    },
    skills: {
        type: [String],
        default: [],
    },
    placement_status: {
        type: String,
        default: 'Not Placed',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
