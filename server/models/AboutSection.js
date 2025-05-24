const mongoose = require('mongoose');

const aboutSectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: [true, 'Section name is required'],
    unique: true, // Each section name should be unique (e.g., 'introduction', 'skills')
    trim: true,
    enum: ['introduction', 'skills', 'education', 'experience', 'contact'] // Define permissible section names
  },
  title: { // An optional title for the section, e.g., "My Skills", "Educational Background"
    type: String,
    trim: true,
  },
  content: {
    type: String, // Can store Markdown, HTML, or plain text
    required: [true, 'Content for the section is required'],
    trim: true,
  },
  isMarkdown: { // New field to indicate if content is Markdown
    type: Boolean,
    default: false, // Default to false, assuming existing content is not Markdown
  },
  // Optional: if you want to have a display order for sections
  // order: {
  //   type: Number,
  //   default: 0
  // }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

// To ensure sectionName is easily queryable and efficient for lookups if it's unique.
// Mongoose automatically creates an index for fields marked as `unique: true`.

const AboutSection = mongoose.model('AboutSection', aboutSectionSchema);

module.exports = AboutSection; 