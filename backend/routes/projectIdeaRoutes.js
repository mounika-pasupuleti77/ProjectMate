const express = require('express');
const router = express.Router();
const {
  getProjectIdeas,
  getProjectIdeaById,
  createProjectIdea,
  updateProjectIdea,
  deleteProjectIdea
} = require('../controllers/projectIdeaController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProjectIdeas);
router.get('/:id', getProjectIdeaById);
router.post('/', protect, createProjectIdea);
router.put('/:id', protect, updateProjectIdea);
router.delete('/:id', protect, deleteProjectIdea);

module.exports = router;
