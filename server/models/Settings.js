const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    institutionName: {
        type: String,
        default: 'Tech University',
    },
    min_attendance: {
        type: Number,
        default: 75,
    },
    autoWarning: {
        type: Boolean,
        default: false,
    },
    emailWeeklyReport: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
