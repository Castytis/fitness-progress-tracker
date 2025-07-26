const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { askTrainer } = require('../controllers/trainerChatController');

router.post('/trainer/ask', authenticateToken, async (req, res, next) => {
  try {
    const { question } = req.body;
    const answer = await askTrainer(question);
    res.json({ answer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
