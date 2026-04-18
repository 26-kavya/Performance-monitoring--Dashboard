const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users (non-students)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // Exclude students from this list if any were accidentally created
    const users = await User.find({ role: { $ne: 'Student' } }).select('-password');
    res.json(users);
});

// @desc    Add a new user (Admin/Instructor)
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
    const { name, email, role, status, password } = req.body;

    if (!name || !email) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    if (role === 'Student') {
        res.status(400);
        throw new Error('Cannot create Student from this form. Please use the Add Student form on the dashboard.');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        role: role || 'Instructor',
        status: status || 'Active',
        password: password || 'password123'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update only what is provided
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).select('-password');

    res.json(updatedUser);
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await user.deleteOne();

    res.json({ id: req.params.id, message: 'User deleted' });
});

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
