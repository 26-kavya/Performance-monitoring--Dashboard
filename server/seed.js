const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const DashboardData = require('./models/DashboardData');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    await connectDB();

    try {
        await Student.deleteMany();
        await DashboardData.deleteMany();

        const students = [
            { name: 'Alice Johnson', email: 'alice@example.com', password: 'student@123', gpa: 3.8, attendance: 95, resume_score: 85, skills: ['React.js', 'Node.js', 'AWS'], placement_status: 'Placed' },
            { name: 'Bob Smith', email: 'bob@example.com', password: 'student@123', gpa: 3.2, attendance: 82, resume_score: 55, skills: ['HTML', 'CSS', 'React.js'], placement_status: 'Not Placed' },
            { name: 'Charlie Brown', email: 'charlie@example.com', password: 'student@123', gpa: 3.5, attendance: 88, resume_score: 75, skills: ['Python', 'SQL'], placement_status: 'Not Placed' },
            { name: 'Diana Prince', email: 'diana@example.com', password: 'student@123', gpa: 3.9, attendance: 98, resume_score: 92, skills: ['Machine Learning', 'Python', 'AWS'], placement_status: 'Placed' },
            { name: 'Ethan Hunt', email: 'ethan@example.com', password: 'student@123', gpa: 3.0, attendance: 75, resume_score: 45, skills: ['Java', 'C++'], placement_status: 'Not Placed' },
        ];

        await Student.insertMany(students);

        const dashboardData = {
            semester: 'Sem 6',
            avgMarks: 88,
            passProps: { pass: 850, fail: 150 },
            attendanceParams: { present: 92, absent: 8 },
            subjectPerformance: [
                { subject: 'Math', marks: 85 },
                { subject: 'Phys', marks: 78 },
                { subject: 'Chem', marks: 92 },
                { subject: 'Bio', marks: 88 },
                { subject: 'CS', marks: 95 },
                { subject: 'Eng', marks: 82 },
            ]
        };

        await DashboardData.create(dashboardData);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
