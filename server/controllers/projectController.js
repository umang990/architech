// server/controllers/projectController.js
const Project = require('../models/Project');

// @desc    Save a new generated project
// @route   POST /api/projects
// @access  Public (or Private if auth added)
const createProject = async (req, res) => {
  try {
    const { name, originalPrompt, userAnswers, files } = req.body;

    const project = await Project.create({
      name: name || 'Untitled Project',
      originalPrompt,
      userAnswers,
      files
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to save project', error: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createProject, getProject };