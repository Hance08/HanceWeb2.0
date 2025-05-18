const PortfolioItem = require('../models/PortfolioItem');

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
exports.getPortfolioItems = async (req, res) => {
  try {
    // const items = await PortfolioItem.find({}).sort({ projectDate: -1 }); // Sort by projectDate descending
    const items = await PortfolioItem.find({}).sort({ createdAt: -1 }); // Or sort by creation date
    res.json(items);
  } catch (error) {
    console.error('Error in getPortfolioItems:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single portfolio item by ID
// @route   GET /api/portfolio/:id
// @access  Public
exports.getPortfolioItemById = async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error in getPortfolioItemById:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Portfolio item not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new portfolio item
// @route   POST /api/portfolio
// @access  Private/Admin
exports.createPortfolioItem = async (req, res) => {
  const {
    title,
    description,
    imageUrl,
    projectUrl,
    repositoryUrl,
    tags,
    projectDate
  } = req.body;

  try {
    const newItem = new PortfolioItem({
      title,
      description,
      imageUrl,
      projectUrl,
      repositoryUrl,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      projectDate,
      createdBy: req.user._id, // Associated with the logged-in admin user
    });

    const createdItem = await newItem.save();
    res.status(201).json(createdItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error in createPortfolioItem:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a portfolio item by ID
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
exports.updatePortfolioItem = async (req, res) => {
  const {
    title,
    description,
    imageUrl,
    projectUrl,
    repositoryUrl,
    tags,
    projectDate
  } = req.body;

  try {
    const item = await PortfolioItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Optional: Check if the user updating is the one who created it, or an admin
    // if (item.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'User not authorized to update this item' });
    // }

    item.title = title || item.title;
    item.description = description || item.description;
    item.imageUrl = imageUrl || item.imageUrl;
    item.projectUrl = projectUrl === undefined ? item.projectUrl : projectUrl; // Allow empty string for clearing
    item.repositoryUrl = repositoryUrl === undefined ? item.repositoryUrl : repositoryUrl; // Allow empty string for clearing
    item.tags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : item.tags;
    item.projectDate = projectDate || item.projectDate;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Portfolio item not found (invalid ID format)' });
    }
    console.error('Error in updatePortfolioItem:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a portfolio item by ID
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
exports.deletePortfolioItem = async (req, res) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Optional: Check if the user deleting is the one who created it, or an admin
    // if (item.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'User not authorized to delete this item' });
    // }

    await item.deleteOne(); // Mongoose v6+ uses deleteOne() on the document
    // For older Mongoose: await item.remove();

    res.json({ message: 'Portfolio item removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Portfolio item not found (invalid ID format)' });
    }
    console.error('Error in deletePortfolioItem:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 