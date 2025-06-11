const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// Get all exercises
router.get('/exercises/public', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        e.id,
        u.username,
        e.name,
        e.description,
        e.category,
        e.muscle_group,
        e.difficulty,
        e.is_private,
        e.created_at
      FROM exercises e
      JOIN users u ON e.created_by = u.id
      WHERE e.is_private = false
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public exercises by user ID
router.get(
  '/exercises/:user_id/public',
  authenticateToken,
  async (req, res) => {
    const userId = req.params.user_id;

    try {
      const result = await db.query(
        `
      SELECT 
        e.id,
        e.name,
        e.description,
        e.category,
        e.muscle_group,
        e.difficulty,
        e.is_private,
        e.created_at
      FROM exercises e
      WHERE e.is_private = false
      AND e.created_by = $1
      `,
        [userId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
