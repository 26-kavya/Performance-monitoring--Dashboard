const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/User');

// Simple mock auth middleware for development since no full auth system exists yet
// In a real app, this would verify JWT tokens
const protect = asyncHandler(async (req, res, next) => {
    // In a real app, this would verify JWT tokens from req.headers.authorization
    // For this demo, we'll use custom headers to identify the active user securely
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];

    try {
        if (userId && userRole) {
            let user = null;
            if (userRole === 'student') {
                user = await Student.findById(userId);
            } else if (userRole === 'admin' || userRole === 'instructor') {
                user = await User.findById(userId);
            }

            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found in database');
            }

            // Attach user to request
            req.user = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: userRole
            };
            next();
            return;
        }

        // Fallback for easy testing without Postman headers
        // Just grab the first student
        const fallbackUser = await Student.findOne();
        if (fallbackUser) {
            req.user = {
                _id: fallbackUser._id,
                name: fallbackUser.name,
                email: fallbackUser.email,
                role: 'student'
            };
            next();
        } else {
            res.status(401);
            throw new Error('Not authorized, no fallback user found');
        }
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401);
        throw new Error('Not authorized or role mismatch');
    }
});

module.exports = { protect };
