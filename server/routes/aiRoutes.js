const express = require('express');
const router = express.Router();
// We only import generateQuestions now. 
// generateCode was moved to projectController.js logic.
const { generateQuestions } = require('../controllers/aiController');

// Route: /api/ai/questions
router.post('/questions', generateQuestions);

module.exports = router;