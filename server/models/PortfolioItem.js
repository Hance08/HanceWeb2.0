const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Portfolio item title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Portfolio item description is required'],
    trim: true,
  },
  imageUrl: {
    type: String, // For now, an external URL or a path to a statically served image
    trim: true,
    // required: [true, 'Image URL is required'], // Make it optional for now if direct upload is not yet implemented
  },
  projectUrl: { // Link to the live project, if applicable
    type: String,
    trim: true,
  },
  repositoryUrl: { // Link to the code repository (e.g., GitHub), if applicable
    type: String,
    trim: true,
  },
  tags: {
    type: [String], // An array of strings for tech stack or categories
    default: [],
    // Example: ['React', 'Node.js', 'MongoDB']
  },
  projectDate: {
    type: Date,
    default: Date.now, // Or you might want a specific project completion date
  },
  // Optional: for ordering items on the portfolio page
  // displayOrder: {
  //   type: Number,
  //   default: 0,
  // },
  // Optional: to mark featured projects
  // isFeatured: {
  //   type: Boolean,
  //   default: false,
  // },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model, to know who created this item (admin)
    // required: true // If you want to enforce this link
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const PortfolioItem = mongoose.model('PortfolioItem', portfolioItemSchema);

module.exports = PortfolioItem; 