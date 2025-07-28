const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { exportFavoriteWorkouts } = require('../controllers/exportControler');

/**
 * @swagger
 * /workouts/favorite/export/csv:
 *   get:
 *     summary: Export user's favorite workouts as a CSV file
 *     tags: [Favorite Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file containing favorite workouts
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/workouts/favorite/export/csv',
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const csv = await exportFavoriteWorkouts(userId);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="favorite_workouts.csv"'
      );
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
