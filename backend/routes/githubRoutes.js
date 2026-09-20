const express = require('express');
const router = express.Router();
const { connectGitHubRepo, getGitHubInfo } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:projectId', protect, connectGitHubRepo);
router.get('/:projectId', protect, getGitHubInfo);

module.exports = router;
