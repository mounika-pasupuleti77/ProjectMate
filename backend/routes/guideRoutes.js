const express = require('express');
const router = express.Router();
const { getGuides, getGuideById } = require('../controllers/guideController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGuides);
router.get('/:id', protect, getGuideById);

module.exports = router;
