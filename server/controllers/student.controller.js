const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');

// @desc    Get student dashboard summary
// @route   GET /api/performance/student/dashboard
// @access  Private/Student
const getStudentDashboard = asyncHandler(async (req, res) => {
    // req.user is set by authMiddleware
    const studentId = req.user._id;

    const student = await Student.findById(studentId);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Calculate Summary Stats
    const totalSubjects = student.marks ? Array.from(student.marks.keys()).length : 0;

    // Calculate pending assignments dynamically
    let assignmentsCount = await Assignment.countDocuments({ studentId });
    if (assignmentsCount === 0) {
        // Lazy-seed mock assignments for this student if completely empty
        const defaultAssignments = [
            { studentId, title: 'Calculus Problem Set 3', subject: 'Mathematics', dueDate: '2026-02-20', status: 'Pending', marks: null },
            { studentId, title: 'Lab Report: Titration', subject: 'Chemistry', dueDate: '2026-02-18', status: 'Pending', marks: null },
            { studentId, title: 'Essay: Modern History', subject: 'History', dueDate: '2026-02-10', status: 'Graded', marks: '85/100' },
            { studentId, title: 'Physics Project', subject: 'Physics', dueDate: '2026-02-25', status: 'Pending', marks: null },
        ];
        await Assignment.insertMany(defaultAssignments);
    }
    const pendingAssignments = await Assignment.countDocuments({ studentId, status: 'Pending' });

    res.json({
        name: student.name,
        email: student.email,
        phoneNumber: student.phoneNumber || '',
        totalSubjects,
        gpa: student.gpa,
        attendance: student.attendance,
        pendingAssignments,
        performanceStatus: student.gpa >= 3.0 ? 'Good' : student.gpa >= 2.0 ? 'Average' : 'Critical'
    });
});

// @desc    Get student marks
// @route   GET /api/performance/student/marks
// @access  Private/Student
const getStudentMarks = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Convert Map to Array for frontend
    const marksArray = [];
    if (student.marks) {
        for (const [subject, mark] of student.marks) {
            // Mocking internal/external split since schema only has total mark
            const internal = Math.round(mark * 0.4);
            const external = mark - internal;
            let grade = 'F';
            if (mark >= 90) grade = 'A+';
            else if (mark >= 80) grade = 'A';
            else if (mark >= 70) grade = 'B';
            else if (mark >= 60) grade = 'C';
            else if (mark >= 50) grade = 'D';

            marksArray.push({
                subject,
                internal,
                external,
                total: mark,
                grade
            });
        }
    }

    res.json(marksArray);
});

// @desc    Get student attendance
// @route   GET /api/performance/student/attendance
// @access  Private/Student
const getStudentAttendance = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Calculate exact totals mathematically from the single DB source of truth
    const overallPercentage = student.attendance;
    const total_classes = 120;
    const attended_classes = Math.round((overallPercentage / 100) * total_classes);

    const baseTotal = 24;
    let remainingAttended = attended_classes;
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
    
    const subjectAttendance = subjects.map((subj, index) => {
        if (index === subjects.length - 1) {
             const attended = remainingAttended;
             return { subject: subj, attended, total: baseTotal, percentage: Math.round((attended/baseTotal)*100) };
        }
        
        const targetMean = remainingAttended / (subjects.length - index);
        let attended = Math.round(targetMean + (Math.random() * 4 - 2));
        attended = Math.max(0, Math.min(baseTotal, attended));
        
        if (remainingAttended - attended > (subjects.length - index - 1) * baseTotal) {
            attended = remainingAttended - (subjects.length - index - 1) * baseTotal;
        }

        remainingAttended -= attended;
        return { subject: subj, attended, total: baseTotal, percentage: Math.round((attended/baseTotal)*100) };
    });

    res.json({
        overall: student.attendance,
        subjectWise: subjectAttendance,
        attended_classes,
        total_classes
    });
});

// @desc    Get student assignments
// @route   GET /api/performance/student/assignments
// @access  Private/Student
const getStudentAssignments = asyncHandler(async (req, res) => {
    const studentId = req.user._id;
    let assignments = await Assignment.find({ studentId });

    if (!assignments || assignments.length === 0) {
        // Lazy-seed mock assignments for this student
        const defaultAssignments = [
            { studentId, title: 'Calculus Problem Set 3', subject: 'Mathematics', dueDate: '2026-02-20', status: 'Pending', marks: null },
            { studentId, title: 'Lab Report: Titration', subject: 'Chemistry', dueDate: '2026-02-18', status: 'Pending', marks: null },
            { studentId, title: 'Essay: Modern History', subject: 'History', dueDate: '2026-02-10', status: 'Graded', marks: '85/100' },
            { studentId, title: 'Physics Project', subject: 'Physics', dueDate: '2026-02-25', status: 'Pending', marks: null },
        ];
        assignments = await Assignment.insertMany(defaultAssignments);
    }

    res.json(assignments);
});

// @desc    Update student assignment
// @route   PATCH /api/performance/student/assignments/:id
// @access  Private/Student
const updateStudentAssignment = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const assignmentId = req.params.id;

    const assignment = await Assignment.findOne({ _id: assignmentId, studentId: req.user._id });

    if (!assignment) {
        res.status(404);
        throw new Error('Assignment not found or unauthorized');
    }

    if (status) assignment.status = status;

    const updatedAssignment = await assignment.save();
    res.json(updatedAssignment);
});

// @desc    Get student notifications
// @route   GET /api/performance/student/notifications
// @access  Private/Student
const getStudentNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient_id: req.user._id }).sort({ createdAt: -1 });
    
    // Fallback seed if totally empty for aesthetic testing
    if (notifications.length === 0) {
        const defaultNotifs = [
            { recipient_id: req.user._id, title: 'Welcome to the Dashboard!', message: 'This is your centralized communication hub.', type: 'info', is_read: false },
        ];
        await Notification.insertMany(defaultNotifs);
        const newSeed = await Notification.find({ recipient_id: req.user._id }).sort({ createdAt: -1 });
        return res.json(newSeed);
    }

    res.json(notifications);
});

// @desc    Mark student notifications as read
// @route   PATCH /api/performance/student/notifications/read
// @access  Private/Student
const markNotificationsRead = asyncHandler(async (req, res) => {
    const { notificationIds } = req.body; // Array of IDs or single ID

    if (!notificationIds || notificationIds.length === 0) {
        return res.status(400).json({ message: 'No notification IDs provided' });
    }

    await Notification.updateMany(
        { _id: { $in: notificationIds }, recipient_id: req.user._id },
        { $set: { is_read: true } }
    );

    res.json({ message: 'Notifications marked as read' });
});

// @desc    Update student profile (Name, Email, Phone, Password)
// @route   PUT /api/performance/student/profile
// @access  Private/Student
const updateStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id);

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    const { name, email, phoneNumber, password } = req.body;

    // Optional: add validation here
    // Optional: if password is changed, hash it before saving

    if (name) student.name = name;
    if (email) student.email = email;
    if (phoneNumber !== undefined) student.phoneNumber = phoneNumber;
    if (password) student.password = password;

    const updatedStudent = await student.save();

    res.json({
        _id: updatedStudent._id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        phoneNumber: updatedStudent.phoneNumber,
        token: req.headers.authorization ? req.headers.authorization.split(' ')[1] : null // Keep existing token
    });
});

// @desc    Authenticate user (Admin, Instructor, or Student)
// @route   POST /api/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    if (email) email = email.trim();
    if (password) password = password.trim();

    // Check for Users (Admin / Instructor)
    const staffUser = await User.findOne({ email });
    if (staffUser && staffUser.password === password) {
        if (staffUser.status !== 'Active') {
            res.status(401);
            throw new Error('This account is inactive.');
        }

        return res.json({
            _id: staffUser._id,
            name: staffUser.name,
            email: staffUser.email,
            role: staffUser.role.toLowerCase(), // frontend expects 'admin' or 'instructor'
            token: 'mock-staff-token-123'
        });
    }

    // Fallback hardcoded Admin check (useful for bootstrapping)
    if (email === 'admin@gmail.com' && password === 'admin@123') {
        return res.json({
            _id: 'admin-id-mock',
            name: 'System Admin',
            email: 'admin@gmail.com',
            role: 'admin',
            token: 'mock-admin-token-123'
        });
    }

    // Check for Student
    const student = await Student.findOne({ email });

    if (student && student.password === password) {
        return res.json({
            _id: student._id,
            name: student.name,
            email: student.email,
            role: 'student',
            token: 'mock-student-token-123'
        });
    }

    res.status(401);
    throw new Error('Invalid email or password');
});

module.exports = {
    getStudentDashboard,
    getStudentMarks,
    getStudentAttendance,
    getStudentAssignments,
    updateStudentAssignment,
    getStudentNotifications,
    markNotificationsRead,
    updateStudentProfile,
    loginUser
};
