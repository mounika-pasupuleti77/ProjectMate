const express = require('express');
const router = express.Router();
const {
  sendTeamRequest,
  getReceivedRequests,
  getSentRequests,
  respondToTeamRequest
} = require('../controllers/teamRequestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendTeamRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.put('/:id', protect, respondToTeamRequest);

module.exports = router;
