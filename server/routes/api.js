const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const DashboardData = require('../models/DashboardData');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const Activity = require('../models/Activity');
const { loginUser } = require('../controllers/student.controller');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller');

// @desc    Login user (Admin/Student)
// @route   POST /api/login
// @access  Public
router.post('/login', loginUser);

// Admin / Instructor Routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// @desc    Get dashboard stats
router.get('/dashboard', async (req, res) => {
    try {
        const students = await Student.find({});

        // Calculate Pass/Fail Ratio
        let passCount = 0;
        let failCount = 0;
        let totalAttendance = 0;

        // Subject Performance Aggregation
        const subjectStats = {};

        students.forEach(student => {
            if (student.gpa >= 2.0) passCount++;
            else failCount++;
            totalAttendance += student.attendance;

            // Aggregate marks
            if (student.marks) {
                for (const [subject, mark] of student.marks) {
                    if (!subjectStats[subject]) {
                        subjectStats[subject] = { total: 0, count: 0 };
                    }
                    subjectStats[subject].total += mark;
                    subjectStats[subject].count += 1;
                }
            }
        });

        const subjectPerformance = Object.keys(subjectStats).map(subject => ({
            subject,
            marks: Math.round(subjectStats[subject].total / subjectStats[subject].count)
        }));

        const avgAttendance = students.length > 0 ? Math.round(totalAttendance / students.length) : 0;
        const absentPercentage = 100 - avgAttendance;

        // Fetch mock data for trends (since we don't have historical data stored yet)
        const analytics = await DashboardData.findOne().sort({ createdAt: -1 });

        res.json({
            subjectPerformance: subjectPerformance.length > 0 ? subjectPerformance : (analytics?.subjectPerformance || []),
            attendanceRadial: {
                present: avgAttendance,
                absent: absentPercentage
            },
            marksTrend: [
                { semester: 'Sem 1', avg: 72 },
                { semester: 'Sem 2', avg: 78 },
                { semester: 'Sem 3', avg: 75 },
                { semester: 'Sem 4', avg: 82 },
                { semester: 'Sem 5', avg: analytics?.avgMarks || 85 },
                { semester: 'Sem 6', avg: 88 },
            ],
            passFailRatio: [
                { name: 'Pass', value: passCount, color: '#10b981' },
                { name: 'Fail', value: failCount, color: '#ef4444' },
            ]
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all students
// @route   GET /api/students
// @access  Public
router.get('/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get recent activities
// @route   GET /api/activities
// @access  Public
router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.find({}).sort({ createdAt: -1 }).limit(5);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a new student
// @route   POST /api/students
// @access  Public
router.post('/students', async (req, res) => {
    try {
        const { name, email, gpa, attendance, department, marks, resume_score, skills, placement_status } = req.body;

        let calculatedGpa = gpa;

        // Calculate GPA if marks are provided and GPA is missing or 0
        if (marks && (!gpa || gpa === 0)) {
            const subjects = Object.values(marks);
            if (subjects.length > 0) {
                const avg = subjects.reduce((a, b) => a + Number(b), 0) / subjects.length;
                calculatedGpa = (avg / 20).toFixed(1); // Simple conversion: 100% -> 5.0
            }
        }

        // Generate and hash default password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('student@123', salt);

        const student = await Student.create({
            name,
            email,
            gpa: calculatedGpa,
            attendance,
            department: department || 'General',
            marks: marks || {},
            resume_score: resume_score || 0,
            skills: skills || [],
            placement_status: placement_status || 'Not Placed',
            password: hashedPassword
        });
        
        await Activity.create({
            action: `Added Student - New student ${student.name} added to ${student.department} Dept.`
        });
        
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Public
router.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.deleteOne();
        res.json({ message: 'Student removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Public
router.put('/students/:id', async (req, res) => {
    try {
        const { name, email, gpa, attendance, department, marks, resume_score, skills, placement_status } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        let activityRecord = null;
        if (placement_status && placement_status !== student.placement_status) {
            activityRecord = `Admin marked ${student.name} as ${placement_status}`;
        }

        student.name = name || student.name;
        student.email = email || student.email;
        student.gpa = gpa || student.gpa;
        student.attendance = attendance || student.attendance;
        student.department = department || student.department;
        if (marks) student.marks = marks;
        if (resume_score !== undefined) student.resume_score = resume_score;
        if (skills) student.skills = skills;
        if (placement_status) student.placement_status = placement_status;

        const updatedStudent = await student.save();
        
        if (activityRecord) {
            await Activity.create({ action: activityRecord });
        }
        
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Reset student password manually by Admin
// @route   POST /api/students/:id/reset-password
// @access  Public (for now)
router.post('/students/:id/reset-password', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash('student@123', salt);
        await student.save();

        await Activity.create({
            action: `Admin reset password for student ${student.name}.`
        });

        res.json({ message: 'Password reset successfully to default' });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Bulk upload students
// @route   POST /api/students/bulk
// @access  Public
router.post('/students/bulk', async (req, res) => {
    try {
        const students = req.body; // Expecting an array of students

        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ message: 'No students data provided' });
        }

        const results = {
            successCount: 0,
            failCount: 0,
            errors: []
        };

        const salt = await bcrypt.genSalt(10);
        const defaultHashedPassword = await bcrypt.hash('student@123', salt);

        // Process each student to ensure correct data types/defaults before insertion
        const processedStudents = students.map(student => {
            let calculatedGpa = Number(student.gpa);
            if (isNaN(calculatedGpa)) calculatedGpa = 0;

            const sanitizedMarks = {};
            if (student.marks) {
                for (const [key, value] of Object.entries(student.marks)) {
                    const num = Number(value);
                    if (!isNaN(num)) sanitizedMarks[key] = num;
                }
            }

            if (Object.keys(sanitizedMarks).length > 0 && (!calculatedGpa || calculatedGpa === 0)) {
                const subjects = Object.values(sanitizedMarks);
                if (subjects.length > 0) {
                    const avg = subjects.reduce((a, b) => a + b, 0) / subjects.length;
                    calculatedGpa = Number((avg / 20).toFixed(1));
                }
            }

            return {
                name: student.name,
                email: student.email,
                gpa: calculatedGpa || 0.0,
                attendance: Number(student.attendance) || 0,
                department: student.department || 'General',
                marks: sanitizedMarks,
                resume_score: Number(student.resume_score) || 0,
                skills: Array.isArray(student.skills) ? student.skills : [],
                placement_status: student.placement_status || 'Not Placed',
                password: defaultHashedPassword
            };
        });

        try {
            // ordered: false allows continuing even if some inserts fail (e.g. duplicates)
            const insertResult = await Student.insertMany(processedStudents, { ordered: false });
            results.successCount = insertResult.length;
        } catch (error) {
            // If ordered: false, error will contain result of successful inserts and writeErrors
            if (error.writeErrors) {
                results.successCount = error.insertedDocs.length;
                results.failCount = error.writeErrors.length;
                error.writeErrors.forEach(err => {
                    const failedDoc = processedStudents[err.index];
                    const errorMsg = err.errmsg || err.message || 'Unknown error';
                    results.errors.push(`Row with email ${failedDoc ? failedDoc.email : 'unknown'}: ${errorMsg}`);
                });
            } else {
                throw error; // Re-throw if it's a different kind of error
            }
        }

        res.status(201).json({
            message: 'Bulk upload processed',
            ...results
        });

        await Activity.create({
            action: `Bulk Upload - ${results.successCount} students uploaded to the database`
        });

    } catch (error) {
        console.error("Bulk upload error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Admin send notification
// @route   POST /api/notifications
// @access  Public (for now)
router.post('/notifications', async (req, res) => {
    try {
        const { title, message, type, priority, recipientType, recipientIds, department } = req.body;
        
        let targetStudentIds = [];

        if (recipientType === 'All Students') {
            const students = await Student.find({}, '_id');
            targetStudentIds = students.map(s => s._id);
        } else if (recipientType === 'Specific Department') {
            const students = await Student.find({ department }, '_id');
            targetStudentIds = students.map(s => s._id);
        } else if (recipientType === 'Selected Students') {
            targetStudentIds = recipientIds || [];
        }

        if (targetStudentIds.length === 0) {
            return res.status(400).json({ message: 'No students found for the selected criteria' });
        }

        const notificationsToInsert = targetStudentIds.map(studentId => ({
            recipient_id: studentId,
            title,
            message,
            type: type || 'info',
            priority: priority || 'Medium',
            is_read: false
        }));

        await Notification.insertMany(notificationsToInsert);

        // Optional: Email Trigger mock
        if (targetStudentIds.length > 0) {
            console.log(`[EMAIL DISPATCH] Mock email successfully triggered for ${targetStudentIds.length} recipient(s) regarding: "${title}"`);
        }

        await Activity.create({
            action: `Sent Warning - Notification sent to ${targetStudentIds.length} student(s) regarding: "${title}"`
        });

        res.status(201).json({ message: `Successfully sent notification to ${targetStudentIds.length} student(s)` });
    } catch (error) {
        console.error("Send notification error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public (for now)
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update global settings & trigger async job
// @route   PUT /api/settings
// @access  Public (for now)
router.put('/settings', async (req, res) => {
    try {
        const { institutionName, min_attendance, autoWarning, emailWeeklyReport } = req.body;
        
        let settings = await Settings.findOne();
        if (!settings) settings = new Settings();

        settings.institutionName = institutionName !== undefined ? institutionName : settings.institutionName;
        settings.min_attendance = min_attendance !== undefined ? min_attendance : settings.min_attendance;
        settings.autoWarning = autoWarning !== undefined ? autoWarning : settings.autoWarning;
        settings.emailWeeklyReport = emailWeeklyReport !== undefined ? emailWeeklyReport : settings.emailWeeklyReport;

        await settings.save();

        // Trigger background job asynchronously (non-blocking)
        (async () => {
            try {
                console.log("[BACKGROUND JOB] Recalculating 'At Risk' statuses based on new threshold:", settings.min_attendance);
                const students = await Student.find({});
                const notificationsToInsert = [];

                for (let student of students) {
                    const currentlyAtRisk = student.isAtRisk;
                    // student is at risk if gpa < 2.0 OR attendance < minAttendanceLimit
                    const shouldBeAtRisk = (student.gpa < 2.0) || (student.attendance < settings.min_attendance);

                    if (currentlyAtRisk !== shouldBeAtRisk) {
                        student.isAtRisk = shouldBeAtRisk;
                        await student.save();

                        // If student just became at risk, and autoWarning is on
                        if (shouldBeAtRisk && settings.autoWarning) {
                            notificationsToInsert.push({
                                recipient_id: student._id,
                                title: 'Automated Warning: At Risk Status',
                                message: `Your recent performance metrics indicate you are currently At Risk. Please ensure your attendance is above ${settings.min_attendance}%.`,
                                type: 'warning',
                                priority: 'High',
                                is_read: false
                            });
                        }
                    }
                }

                if (notificationsToInsert.length > 0) {
                    await Notification.insertMany(notificationsToInsert);
                    console.log(`[BACKGROUND JOB] Dispatched ${notificationsToInsert.length} auto-warning notifications.`);
                }
            } catch (jobError) {
                console.error("[BACKGROUND JOB ERROR]:", jobError);
            }
        })();

        await Activity.create({
            action: `Updated Settings - Configured global settings`
        });

        res.json(settings);
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
