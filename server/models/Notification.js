const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    recipient_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'success'],
        default: 'info'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    is_read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // This guarantees created_at and updated_at
});

module.exports = mongoose.model('Notification', notificationSchema);
