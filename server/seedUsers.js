const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    { name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active', password: 'password123' },
    { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Instructor', status: 'Active', password: 'password123' },
    { name: 'Admin User', email: 'admin@edu.com', role: 'Admin', status: 'Active', password: 'password123' },
    { name: 'Kavya', email: 'kavya@admin.com', role: 'Admin', status: 'Active', password: 'kavya' }
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/school_dashboard');

        // Remove existing users to avoid duplicates if run multiple times
        await User.deleteMany();

        await User.insertMany(users);
        console.log('User Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
