const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

const {
  getAllPublicExercises,
  getPublicExerciseById,
} = require('../controllers/exercisesController.js');

router.get('/exercises/public', authenticateToken, async (req, res) => {
  const exercises = await getAllPublicExercises();

  res.json(exercises.exercises);
});

router.get('/exercises/public/:id', authenticateToken, async (req, res) => {
  const exerciseId = req.params.id;

  const exercise = await getPublicExerciseById(exerciseId);

  res.json(exercise.exercise);
});

module.exports = router;
