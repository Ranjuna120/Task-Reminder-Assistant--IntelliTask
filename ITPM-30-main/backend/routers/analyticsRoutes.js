const express = require('express');
const router = express.Router();
const AnalyticsController = require('../controllers/analyticsController');

// Get task statistics for a user
router.get('/analytics/statistics/:userId', AnalyticsController.getTaskStatistics);

// Get completion trend (last 7 days)
router.get('/analytics/trend/:userId', AnalyticsController.getCompletionTrend);

// Get category distribution
router.get('/analytics/categories/:userId', AnalyticsController.getCategoryDistribution);

// Get productivity insights
router.get('/analytics/insights/:userId', AnalyticsController.getProductivityInsights);

// Get upcoming deadlines
router.get('/analytics/deadlines/:userId', AnalyticsController.getUpcomingDeadlines);

module.exports = router;
