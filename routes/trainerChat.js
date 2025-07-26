const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const validateTrainerQuestion = require('../middleware/validateTrainerQuestion');
const { askTrainer } = require('../controllers/trainerChatController');

router.post(
  '/trainer/ask',
  authenticateToken,
  validateTrainerQuestion,
  async (req, res, next) => {
    try {
      const { question } = req.body;
      const answer = await askTrainer(question);
      res.json({ answer });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
