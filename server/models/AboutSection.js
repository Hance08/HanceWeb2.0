const mongoose = require('mongoose');

const ALLOWED_SECTION_NAMES = ['introduction', 'skills', 'education', 'experience', 'contact'];

// --- Base Schema Options ---
const baseSchemaOptions = {
  discriminatorKey: 'sectionName', // Key to differentiate section types
  timestamps: true // Adds createdAt and updatedAt
};

// --- Base Schema Definition ---
// Common fields for all section types.
// 'content' and 'isMarkdown' will be defined in the discriminator schemas as they vary.
const baseSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: [true, 'Section name is required'],
    unique: true,
    trim: true,
    enum: ALLOWED_SECTION_NAMES
  },
  title: { // Optional title for the section, e.g., "My Skills", "Educational Background"
    type: String,
    trim: true,
  }
}, baseSchemaOptions);

// Create the base model from which discriminators will inherit
const AboutSection = mongoose.model('AboutSection', baseSchema);

// --- Discriminator-Specific Schemas ---

// 1. Schema for 'introduction' and other sections that primarily use text/markdown content
const TextContentSectionSchema = new mongoose.Schema({
  content: {
    type: String, // Can store Markdown, HTML, or plain text
    required: [true, 'Content for the section is required'],
    trim: true,
  },
  isMarkdown: {
    type: Boolean,
    default: false, // Default to false, assuming content is not Markdown unless specified
  }
}, { _id: false }); // No separate _id for these discriminator fields themselves

// 2. Schema for individual skill items within the 'skills' section
const skillItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  level: { // e.g., 'Proficient', 'Intermediate', 'Beginner'
    type: String,
    trim: true
  },
  category: { // e.g., 'Programming Language', 'Framework', 'Tool'
    type: String,
    trim: true
  },
  icon: { // Optional: class name (e.g., for Font Awesome) or URL for an icon
    type: String,
    trim: true
  },
  description: { // Optional: short description of the skill (plain text for now)
    type: String,
    trim: true
  }
}, { _id: false }); // Subdocuments in an array don't usually need their own _id

// 3. Schema for the 'skills' section, its content will be an array of skillItemSchema
const SkillsSectionSchema = new mongoose.Schema({
  content: {
    type: [skillItemSchema],
    required: [true, 'Skills content (array of skill items) is required'],
    default: [] // Default to an empty array if no skills are provided initially
  }
  // Note: A top-level 'isMarkdown' is not directly applicable here since content is structured.
  // If individual skill descriptions needed Markdown, a flag would go into skillItemSchema.
}, { _id: false });

// --- Applying Discriminators to the Base Model ---
// For each value in ALLOWED_SECTION_NAMES, we assign a schema.

// 'introduction' uses TextContentSectionSchema
AboutSection.discriminator(ALLOWED_SECTION_NAMES[0], TextContentSectionSchema); // 'introduction'

// 'skills' uses SkillsSectionSchema
AboutSection.discriminator(ALLOWED_SECTION_NAMES[1], SkillsSectionSchema); // 'skills'

// 'education', 'experience', 'contact' also use TextContentSectionSchema
AboutSection.discriminator(ALLOWED_SECTION_NAMES[2], TextContentSectionSchema); // 'education'
AboutSection.discriminator(ALLOWED_SECTION_NAMES[3], TextContentSectionSchema); // 'experience'
AboutSection.discriminator(ALLOWED_SECTION_NAMES[4], TextContentSectionSchema); // 'contact'


// Export the base model. Operations (create, find, etc.) are performed on AboutSection,
// and Mongoose handles routing to the correct discriminator schema based on 'sectionName'.
module.exports = AboutSection; 