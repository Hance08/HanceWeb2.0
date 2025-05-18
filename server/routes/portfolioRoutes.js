const express = require('express');
const router = express.Router();
const {
  getPortfolioItems,
  getPortfolioItemById,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} = require('../controllers/portfolioController');
const { protect, admin } = require('../middlewares/authMiddleware');

// @route   GET /api/portfolio
// @desc    Get all portfolio items
// @access  Public
router.get('/', getPortfolioItems);

// @route   GET /api/portfolio/:id
// @desc    Get a single portfolio item by ID
// @access  Public
router.get('/:id', getPortfolioItemById);

// @route   POST /api/portfolio
// @desc    Create a new portfolio item
// @access  Private/Admin
router.post('/', protect, admin, createPortfolioItem);

// @route   PUT /api/portfolio/:id
// @desc    Update a portfolio item by ID
// @access  Private/Admin
router.put('/:id', protect, admin, updatePortfolioItem);

// @route   DELETE /api/portfolio/:id
// @desc    Delete a portfolio item by ID
// @access  Private/Admin
router.delete('/:id', protect, admin, deletePortfolioItem);

module.exports = router; 