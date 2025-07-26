const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

const {
  getAllPublicExercises,
  getPublicExerciseById,
} = require('../controllers/exercisesController.js');

router.get('/exercises/public', authenticateToken, async (req, res, next) => {
  try {
    const filters = req.query;
    const exercises = await getAllPublicExercises(filters);

    res.json(exercises.exercises);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/exercises/public/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const exerciseId = req.params.id;

      const exercise = await getPublicExerciseById(exerciseId);

      res.json(exercise.exercise);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
