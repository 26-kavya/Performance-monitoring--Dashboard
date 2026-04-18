const express = require('express');
const router = express.Router();
const {
    getStudentDashboard,
    getStudentMarks,
    getStudentAttendance,
    getStudentAssignments,
    updateStudentAssignment,
    getStudentNotifications,
    markNotificationsRead,
    updateStudentProfile
} = require('../controllers/student.controller');
const { protect } = require('../middleware/authMiddleware');
const { allowRole } = require('../middleware/roleMiddleware'); // Not used yet but ready for stricter RBAC

// Base path: /api/performance/student (configured in server.js)

// Apply protection to all routes
// For now, our mock protect middleware forces 'student' role, so allowRole('student') is redundant but good practice
router.use(protect);

router.get('/dashboard', getStudentDashboard);
router.get('/marks', getStudentMarks);
router.get('/attendance', getStudentAttendance);
router.get('/assignments', getStudentAssignments);
router.patch('/assignments/:id', updateStudentAssignment);
router.get('/notifications', getStudentNotifications);
router.patch('/notifications/read', markNotificationsRead);
router.put('/profile', updateStudentProfile);

module.exports = router;
