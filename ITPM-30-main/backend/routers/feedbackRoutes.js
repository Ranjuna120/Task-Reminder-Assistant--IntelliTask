const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Get all feedback
router.get('/feedback', feedbackController.getAllFeedback);

// Create new feedback
router.post('/feedback', feedbackController.createFeedback);

// Update feedback
router.put('/feedback/:id', feedbackController.updateFeedback);

// Delete feedback
router.delete('/feedback/:id', feedbackController.deleteFeedback);

// Admin response to feedback
router.put('/response/:id', feedbackController.respondToFeedback);

module.exports = router;