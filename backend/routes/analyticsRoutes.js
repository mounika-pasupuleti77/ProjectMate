const express = require('express');
const router = express.Router();
const { getPlatformAnalytics, getProjectAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getPlatformAnalytics);
router.get('/project/:projectId', protect, getProjectAnalytics);

module.exports = router;
