const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const {
  getAllPublicWorkouts,
  getPublicWorkoutById,
} = require('../controllers/workoutController');

router.get('/workouts/public', authenticateToken, async (req, res) => {
  const workouts = await getAllPublicWorkouts();

  res.json(workouts.workouts);
});

router.get('/workouts/public/:id', authenticateToken, async (req, res) => {
  const workoutId = req.params.id;

  const workout = await getPublicWorkoutById(workoutId);

  res.json(workout.workout);
});

module.exports = router;
