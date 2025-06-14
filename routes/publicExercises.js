const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// Get all exercises
router.get('/exercises/public', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id,
        name,
        description,
        category,
        muscle_group,
        difficulty,
        is_private,
        created_at
      FROM exercises 
      WHERE is_private = false
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific public exercise by ID
router.get('/exercises/public/:id', authenticateToken, async (req, res) => {
  const exercise_id = req.params.id;

  try {
    const result = await db.query(
      `
      SELECT 
        id,
        name,
        description,
        category,
        muscle_group,
        difficulty,
        is_private,
        created_at
      FROM exercises 
      WHERE is_private = false 
      AND id = $1
      `,
      [exercise_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
