const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');
const {
  getAllUsersExercises,
  getUsersExerciseById,
  createExercise,
  updateUsersExercise,
  deleteUsersExercise,
} = require('../controllers/exercisesController');

// Get all users exercises
router.get('/exercises/private', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const exercises = await getAllUsersExercises(userId);

  res.json(exercises.exercise);
});

// Get specific users exercise by ID
router.get('/exercises/private/:id', authenticateToken, async (req, res) => {
  const exerciseId = req.params.id;
  const userId = req.user.id;

  const exercise = await getUsersExerciseById(userId, exerciseId);

  res.json(exercise.exercise);
});

// Create a new exercise
router.post('/exercises/private', authenticateToken, async (req, res) => {
  const { name, description, category, muscle_group, difficulty, is_private } =
    req.body;

  const userId = req.user.id;

  const exercise = await createExercise(
    userId,
    name,
    description,
    category,
    muscle_group,
    difficulty,
    is_private
  );

  res.json(exercise.exercise);
});

// Update exercise
router.put('/exercises/private/:id', authenticateToken, async (req, res) => {
  const { name, description, category, muscle_group, difficulty, is_private } =
    req.body;

  const exerciseId = req.params.id;
  const userId = req.user.id;

  const exercise = await updateUsersExercise(
    userId,
    name,
    description,
    category,
    muscle_group,
    difficulty,
    is_private,
    exerciseId
  );

  res.json(exercise.exercise);
});

// Delete exercise
router.delete('/exercises/private/:id', authenticateToken, async (req, res) => {
  const exerciseId = req.params.id;
  const userId = req.user.id;

  await deleteUsersExercise(userId, exerciseId);

  res.json({ message: 'Successfully deleted exercise' });
});

module.exports = router;
