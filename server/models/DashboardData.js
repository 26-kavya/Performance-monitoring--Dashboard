const mongoose = require('mongoose');

const dashboardDataSchema = mongoose.Schema({
    semester: {
        type: String,
        required: true,
    },
    avgMarks: {
        type: Number,
        required: true,
    },
    passProps: {
        pass: Number,
        fail: Number,
    },
    attendanceParams: {
        present: Number,
        absent: Number,
    },
    subjectPerformance: [{
        subject: String,
        marks: Number
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('DashboardData', dashboardDataSchema);
