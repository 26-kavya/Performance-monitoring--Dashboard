const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    dueDate: {
        type: String, // Kept as string to easily match '2026-02-20' etc from requirements
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Graded'],
        default: 'Pending'
    },
    marks: {
        type: String, // e.g. '85/100', null if not graded
        default: null
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Assignment', assignmentSchema);
