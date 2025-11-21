const express = require('express');
const router = express.Router();
const { startGeneration, updateProject, stopGeneration, getProject, getMyProjects, deleteProject, sendChatMessage } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startGeneration);
router.post('/:id/update', protect, updateProject); // NEW
router.post('/:id/stop', protect, stopGeneration);
router.get('/my-projects', protect, getMyProjects);
router.get('/:id', protect, getProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/chat', protect, sendChatMessage);

module.exports = router;