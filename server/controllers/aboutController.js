const AboutSection = require('../models/AboutSection');

// @desc    Get a specific section of About Me content
// @route   GET /api/about/:sectionName
// @access  Public
exports.getAboutSection = async (req, res) => {
  try {
    const section = await AboutSection.findOne({ sectionName: req.params.sectionName });
    if (!section) {
      // If section not found, we can choose to return 404 or an empty/default content
      // For now, let's return 404 if a section defined in enum is not found (meaning it hasn't been created yet)
      // Or, you might want to create it on the fly with default content if that fits your UX.
      return res.status(404).json({ message: 'About section not found' });
    }
    res.json(section);
  } catch (error) {
    console.error('Error in getAboutSection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or Update a specific section of About Me content
// @route   PUT /api/about/:sectionName
// @access  Private/Admin
exports.updateAboutSection = async (req, res) => {
  const { sectionName } = req.params;
  const { title, content, isMarkdown } = req.body;

  // Validate that sectionName is one of the allowed enum values from the model
  if (!AboutSection.schema.path('sectionName').enumValues.includes(sectionName)) {
    return res.status(400).json({ message: `Invalid section name: ${sectionName}` });
  }

  try {
    let section = await AboutSection.findOne({ sectionName });

    if (section) {
      // Update existing section
      section.title = title !== undefined ? title : section.title; // Update title if provided
      section.content = content !== undefined ? content : section.content; // Update content if provided
      section.isMarkdown = isMarkdown !== undefined ? isMarkdown : section.isMarkdown; // Update isMarkdown if provided
      // section.order = order !== undefined ? order : section.order; // If using order
    } else {
      // Create new section if it doesn't exist (upsert logic)
      // This ensures that an admin can create sections for the first time
      section = new AboutSection({ sectionName, title, content, isMarkdown });
    }

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Error in updateAboutSection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all About Me sections (Optional)
// @route   GET /api/about
// @access  Public
exports.getAllAboutSections = async (req, res) => {
  try {
    // const sections = await AboutSection.find({}).sort('order'); // If using order
    const sections = await AboutSection.find({});
    res.json(sections);
  } catch (error) {
    console.error('Error in getAllAboutSections:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 