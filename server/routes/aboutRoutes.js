const express = require('express');
const router = express.Router();
const {
  getAboutSection,
  updateAboutSection,
  getAllAboutSections
} = require('../controllers/aboutController');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   GET /api/about/:sectionName
// @desc    Get a specific about section
// @access  Public
router.get('/:sectionName', getAboutSection);

// @route   PUT /api/about/:sectionName
// @desc    Update a specific about section
// @access  Private/Admin
router.put('/:sectionName', protect, admin, updateAboutSection); // Protected route

// @route   GET /api/about
// @desc    Get all about sections (Optional)
// @access  Public
router.get('/', getAllAboutSections);

module.exports = router; 