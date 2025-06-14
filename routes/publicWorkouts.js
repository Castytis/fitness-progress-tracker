const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// Get all workouts
router.get('/workouts/public', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM workouts WHERE is_private = false`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific public workout by ID
router.get('/workouts/public/:id', authenticateToken, async (req, res) => {
  const workoutId = req.params.id;

  try {
    const workoutResult = await db.query(
      `SELECT * FROM workouts WHERE id = $1 AND is_private = false`,
      [workoutId]
    );

    if (!workoutResult.rows.length) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    const exercisesResult = await db.query(
      `SELECT exercise_id, sets, reps, duration_minutes, notes FROM workout_exercises WHERE workout_id = $1`,
      [workoutId]
    );

    const workout = workoutResult.rows[0];
    workout.exercises = exercisesResult.rows;

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
