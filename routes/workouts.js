const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// Get all workouts
router.get('/workouts', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query('SELECT * FROM workouts WHERE user_id = $1', [
      userId,
    ]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new workout
router.post('/workouts', authenticateToken, async (req, res) => {
  const {
    title,
    description,
    workout_type,
    duration_minutes,
    calories_burned,
    difficulty,
  } = req.body;

  const userId = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO workouts (user_id, title, description, workout_type, duration_minutes, calories_burned, difficulty)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        userId,
        title,
        description,
        workout_type,
        duration_minutes,
        calories_burned,
        difficulty,
      ]
    );

    res.status(201).json({
      message: 'Workout created successfully',
      workout: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a workout
router.put('/workouts/:id', authenticateToken, async (req, res) => {
  const workoutId = req.params.id;
  const userId = req.user.id;

  const {
    title,
    description,
    workout_type,
    duration_minutes,
    calories_burned,
    difficulty,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE workouts
         SET title = $1, description = $2, workout_type = $3, duration_minutes = $4, calories_burned = $5, difficulty = $6
         WHERE id = $7 AND user_id = $8 RETURNING *`,
      [
        title,
        description,
        workout_type,
        duration_minutes,
        calories_burned,
        difficulty,
        workoutId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({
      message: 'Workout updated successfully',
      workout: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a workout
router.delete('/workouts/:id', authenticateToken, async (req, res) => {
  const workoutId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING *`,
      [workoutId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
