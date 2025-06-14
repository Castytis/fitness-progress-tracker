const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// Get all workouts
router.get('/workouts/private', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const workoutResult = await db.query(
      `SELECT * FROM workouts WHERE created_by = $1`,
      [userId]
    );

    if (workoutResult.rows.length === 0)
      return res.status(404).json({ message: 'No workouts found' });

    const workouts = workoutResult.rows;
    for (const workout of workouts) {
      const exercisesResult = await db.query(
        `SELECT exercise_id, sets, reps, duration_minutes, notes FROM workout_exercises WHERE workout_id = $1`,
        [workout.id]
      );
      workout.exercises = exercisesResult.rows;
    }

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific workout by ID
router.get('/workouts/private/:id', authenticateToken, async (req, res) => {
  const workoutId = req.params.id;
  const userId = req.user.id;

  try {
    const workoutResult = await db.query(
      `SELECT * FROM workouts WHERE id = $1 AND created_by = $2`,
      [workoutId, userId]
    );
    if (workoutResult.rows.length === 0)
      return res.status(404).json({ message: 'Workout not found' });

    const exercisesResult = await db.query(
      `SELECT exercise_id, sets, reps, duration_minutes, notes FROM workout_exercises WHERE workout_id = $1`,
      [workoutId]
    );

    const workout = workoutResult.rows[0];
    workout.exercises = exercisesResult.rows;

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new workout
router.post('/workouts/private', authenticateToken, async (req, res) => {
  const { name, description, is_private, exercises } = req.body;

  const userId = req.user.id;

  try {
    const result = await db.query(
      `
        INSERT INTO workouts 
        (created_by, name, description, is_private) 
        VALUES ($1, $2, $3, $4) RETURNING *
    `,
      [userId, name, description, is_private]
    );

    const workoutId = result.rows[0].id;

    for (const exercise of exercises) {
      await db.query(
        `
            INSERT INTO workout_exercises (created_by, workout_id, exercise_id, sets, reps, duration_minutes, notes) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          userId,
          workoutId,
          exercise.exercise_id,
          exercise.sets,
          exercise.reps,
          exercise.duration_minutes,
          exercise.notes,
        ]
      );
    }

    res.status(201).json({
      message: 'Workout created successfully',
      workout: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
