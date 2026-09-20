const express = require('express');
const router = express.Router();
const { getTeamById, updateTeam } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getTeamById);
router.put('/:id', protect, updateTeam);

module.exports = router;
