const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getFavoriteWorkouts,
  addFavoriteWorkout,
  removeFavoriteWorkout,
} = require('../controllers/favoriteWorkoutController');

router.get('/workouts/favorite', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await getFavoriteWorkouts(userId);

    res.json(favorites);
  } catch (err) {
    next(err);
  }
});

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
