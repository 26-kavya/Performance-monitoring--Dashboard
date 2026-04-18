require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Student = require('../models/Student');

const seedPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/performance_dashboard');
        console.log('MongoDB Connected');

        const result = await Student.updateMany(
            {},
            { $set: { password: 'student@123' } }
        );

        console.log(`Successfully updated ${result.modifiedCount} students with default password.`);
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedPasswords();
