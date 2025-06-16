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

  // Validate that sectionName is one of the allowed enum values
  // Mongoose schema validation on save() will also catch this.
  // Accessing enumValues directly from the schema path for base fields.
  if (!AboutSection.schema.path('sectionName').enumValues.includes(sectionName)) {
    return res.status(400).json({ message: `Invalid section name: ${sectionName}` });
  }

  try {
    let section = await AboutSection.findOne({ sectionName });

    if (!section) {
      // Create new section
      const initialData = { sectionName, title };

      if (sectionName === 'skills') {
        initialData.content = Array.isArray(content) ? content : (content !== undefined ? [] : undefined);
        // isMarkdown is not applicable to SkillsSection directly.
      } else {
        // For TextContent sections (introduction, education, etc.)
        initialData.content = content;
        if (isMarkdown !== undefined) {
          initialData.isMarkdown = isMarkdown;
        }
      }
      section = new AboutSection(initialData);
    } else {
      // Update existing section
      if (title !== undefined) {
        section.title = title;
      }

      if (content !== undefined) {
        section.content = content;
      }

      // Only attempt to set isMarkdown if the section is not 'skills' (or other structured types)
      // and isMarkdown is provided.
      if (sectionName !== 'skills' && isMarkdown !== undefined) {
         // Check if the path exists on the specific discriminator model's schema
         const DiscriminatorModel = AboutSection.discriminators[sectionName];
         if (DiscriminatorModel && DiscriminatorModel.schema.path('isMarkdown')) {
            section.isMarkdown = isMarkdown;
         } else if (!DiscriminatorModel && AboutSection.schema.path('isMarkdown')){
            // This case might apply if it's a base model field somehow, though unlikely with current setup
            // For TextContentSection types, they inherit from base and then have their own schema applied,
            // but isMarkdown is defined on the TextContentSectionSchema itself, not base.
            // This logic branch might be redundant if all text sections use TextContentSectionSchema
            // which is added via discriminator, so check on DiscriminatorModel is more direct.
         }      
      } else if (sectionName === 'skills') {
        // Ensure isMarkdown is not set on skills sections
        // Mongoose might strip fields not in schema, but being explicit can be good.
        if (section.isMarkdown !== undefined) {
            section.isMarkdown = undefined; 
        }
      }
    }

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (error) {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        console.error('Validation Error in updateAboutSection:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: `Validation Failed: ${messages.join(', ')}` });
    }
    console.error(`Error in updateAboutSection for section '${sectionName}':`, error);
    res.status(500).json({ message: 'Server error during update.' });
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