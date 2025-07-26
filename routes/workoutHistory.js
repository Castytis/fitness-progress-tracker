const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getWorkoutHistory,
  logCompletedWorkout,
} = require('../controllers/workoutHistoryController');

router.get('/workouts/history', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const workoutHistory = await getWorkoutHistory(userId);

    res.json(workoutHistory.workouts);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/workouts/complete/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const workoutId = req.params.id;
      const notes = req.body.notes;

      const completedWorkout = await logCompletedWorkout(
        userId,
        workoutId,
        notes
      );

      res.status(201).json(completedWorkout.workout);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
