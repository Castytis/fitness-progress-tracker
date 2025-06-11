const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

// Get all users exercises
router.get('/exercises/personal', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT * FROM exercises WHERE created_by = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new exercises
router.post('/exercises/personal', authenticateToken, async (req, res) => {
  const { name, description, category, muscle_group, difficulty, is_private } =
    req.body;

  const userId = req.user.id;

  try {
    const result = await db.query(
      `INSERT INTO exercises 
        (created_by, name, description, category, muscle_group, difficulty, is_private) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        userId,
        name,
        description,
        category,
        muscle_group,
        difficulty,
        is_private,
      ]
    );

    res.status(201).json({
      message: 'Exercise created successfully',
      exercise: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update a users exercises
router.put('/exercises/personal/:id', authenticateToken, async (req, res) => {
  const { name, description, category, muscle_group, difficulty, is_private } =
    req.body;

  const exerciseId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `UPDATE exercises
       SET name = $1,
           description = $2,
           category = $3,
           muscle_group = $4,
           difficulty = $5,
           is_private = $6
       WHERE id = $7 AND created_by = $8
       RETURNING *`,
      [
        name,
        description,
        category,
        muscle_group,
        difficulty,
        is_private,
        exerciseId,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json({
      message: 'Exercise updated successfully',
      exercise: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete a users exercises
router.delete(
  '/exercises/personal/:id',
  authenticateToken,
  async (req, res) => {
    const exerciseId = req.params.id;
    const userId = req.user.id;

    try {
      const result = await db.query(
        `DELETE FROM exercises WHERE id = $1 AND created_by = $2 RETURNING *`,
        [exerciseId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Exercise not found' });
      }

      res.json({ message: 'Exercise deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
