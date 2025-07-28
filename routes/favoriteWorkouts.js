const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getFavoriteWorkouts,
  addFavoriteWorkout,
  removeFavoriteWorkout,
} = require('../controllers/favoriteWorkoutController');

/**
 * @swagger
 * /workouts/favorite:
 *   get:
 *     summary: Get the user's favorite workouts
 *     tags: [Favorite Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   is_private:
 *                     type: boolean
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   created_by:
 *                     type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/workouts/favorite', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await getFavoriteWorkouts(userId);

    res.json(favorites);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /workouts/favorite/{id}:
 *   post:
 *     summary: Add a workout to the user's favorites
 *     tags: [Favorite Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
 *     responses:
 *       201:
 *         description: Workout favorited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 workout_id:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Already favorited
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/workouts/favorite/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const workoutId = req.params.id;

      const favorite = await addFavoriteWorkout(userId, workoutId);

      res
        .status(201)
        .json(favorite || { message: 'Workout is already favorited' });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /workouts/favorite/{id}:
 *   delete:
 *     summary: Remove a workout from the user's favorites
 *     tags: [Favorite Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Workout unfavorited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Favorite not found
 */
router.delete(
  '/workouts/favorite/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const workoutId = req.params.id;

      const deletedMessage = await removeFavoriteWorkout(userId, workoutId);
      res.json(deletedMessage);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
