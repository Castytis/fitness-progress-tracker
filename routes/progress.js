const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { getProgressSummary } = require('../controllers/getProgressSummary');

/**
 * @swagger
 * /progress/summary:
 *   get:
 *     summary: Get a summary of user progress (completed workouts and weight history)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the summary (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the summary (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Progress summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 completedWorkouts:
 *                   type: string
 *                 listOfCompletedWorkouts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       completed_at:
 *                         type: string
 *                         format: date-time
 *                       name:
 *                         type: string
 *                 weight:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       weight_kg:
 *                         type: string
 *                       recorded_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
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
