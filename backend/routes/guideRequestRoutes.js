const express = require('express');
const router = express.Router();
const {
  sendGuideRequest,
  getGuideRequests,
  respondToGuideRequest
} = require('../controllers/guideRequestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendGuideRequest);
router.get('/', protect, getGuideRequests);
router.put('/:id', protect, respondToGuideRequest);

module.exports = router;
