const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getProgressSummary } = require('../controllers/getProgressSummary');

router.get('/progress/summary', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const summary = await getProgressSummary(userId);
  res.json(summary);
});

module.exports = router;
