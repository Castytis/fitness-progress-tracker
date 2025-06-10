const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// Get all workouts
router.get('/workouts/public', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
    SELECT 
        w.id,
        u.username,
        w.title,
        w.description,
        w.workout_type, 
        w.duration_minutes,
        w.calories_burned,
        w.difficulty,
        w.date
    FROM workouts w
    JOIN users u ON w.user_id = u.id
    WHERE w.is_private = false`);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/workouts/:user_id/public', authenticateToken, async (req, res) => {
  const userId = req.params.user_id;

  try {
    const result = await db.query(
      `
    SELECT 
        w.id,
        w.title,
        w.description,
        w.workout_type, 
        w.duration_minutes,
        w.calories_burned,
        w.difficulty,
        w.date
    FROM workouts w
    JOIN users u ON w.user_id = u.id
    WHERE w.is_private = false
    AND u.id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
