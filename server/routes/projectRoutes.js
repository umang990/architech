// server/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const { createProject, getProject } = require('../controllers/projectController');

// Route: /api/projects/
router.post('/', createProject);

// Route: /api/projects/:id
router.get('/:id', getProject);

module.exports = router;