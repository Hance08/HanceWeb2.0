const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = await User.create({
      username,
      password, // Password will be hashed by the pre-save hook in User model
      role,     // Optional, defaults to 'user' if not provided
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role),
        message: 'User registered successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // Handle Mongoose validation errors or other errors
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error in registerUser:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check for user by username (case-insensitive due to model schema)
    const user = await User.findOne({ username });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role),
        message: 'Login successful'
      });
    } else {
      // Generic message for security (don't specify if username or password was wrong)
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user profile (Example of a protected route)
// @route   GET /api/auth/profile
// @access  Private (requires token)
exports.getUserProfile = async (req, res) => {
  // req.user will be set by the authentication middleware
  const user = await User.findById(req.user.id).select('-password'); // Exclude password
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' }); // Should not happen if token is valid and user exists
  }
}; 