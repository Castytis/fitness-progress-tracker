const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const validateTrainerQuestion = require('../middleware/validateTrainerQuestion');
const trainerChatLimiter = require('../middleware/trainerChatLimiter');
const { askTrainer } = require('../controllers/trainerChatController');

/**
 * @swagger
 * /trainer/ask:
 *   post:
 *     summary: Ask the AI trainer a fitness question
 *     tags: [Trainer Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: How can I improve my bench press?
 *     responses:
 *       200:
 *         description: AI trainer's answer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Too many requests (rate limited)
 */
router.post(
  '/trainer/ask',
  authenticateToken,
  trainerChatLimiter,
  validateTrainerQuestion,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { question } = req.body;
      const answer = await askTrainer(question, userId);
      res.json({ answer });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
