const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getProgressSummary } = require('../controllers/getProgressSummary');

router.get('/progress/summary', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const summary = await getProgressSummary(userId, startDate, endDate);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
