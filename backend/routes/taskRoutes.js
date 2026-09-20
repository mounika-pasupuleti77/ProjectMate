const express = require('express');
const router = express.Router();
const { updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
