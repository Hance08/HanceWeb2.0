const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware'); // Import protect middleware
// const { admin } = require('../middlewares/authMiddleware'); // For admin-only routes, later

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, getUserProfile); // Apply protect middleware

module.exports = router; 