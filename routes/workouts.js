const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

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

module.exports = router;
