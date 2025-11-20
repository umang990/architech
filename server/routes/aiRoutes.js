// server/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateQuestions, generateCode } = require('../controllers/aiController');

// Route: /api/ai/questions
router.post('/questions', generateQuestions);

// Route: /api/ai/generate-code
router.post('/generate-code', generateCode);

module.exports = router;