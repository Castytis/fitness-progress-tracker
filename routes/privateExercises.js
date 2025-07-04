const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllUsersExercises,
  getUsersExerciseById,
  createExercise,
  updateUsersExercise,
  deleteUsersExercise,
} = require('../controllers/exercisesController');

router.get('/exercises/private', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const filters = req.query;

  const exercises = await getAllUsersExercises(userId, filters);

  res.json(exercises.exercises);
});

router.get('/exercises/private/:id', authenticateToken, async (req, res) => {
  const exerciseId = req.params.id;
  const userId = req.user.id;

  const exercise = await getUsersExerciseById(userId, exerciseId);

  res.json(exercise.exercise);
});

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

router.delete('/exercises/private/:id', authenticateToken, async (req, res) => {
  const exerciseId = req.params.id;
  const userId = req.user.id;

  const exercise = await deleteUsersExercise(userId, exerciseId);

  res.json(exercise);
});

module.exports = router;
