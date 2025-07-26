const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const {
  getAllUsersWorkouts,
  getUsersWorkoutById,
  createWorkout,
  updateUsersWorkout,
  deleteUsersWorkout,
} = require('../controllers/workoutController.js');

router.get('/workouts/private', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const workouts = await getAllUsersWorkouts(userId, filters);

    res.json(workouts.workouts);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/workouts/private/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const workoutId = req.params.id;
      const userId = req.user.id;

      const workout = await getUsersWorkoutById(userId, workoutId);

      res.json(workout.workout);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/workouts/private', authenticateToken, async (req, res, next) => {
  try {
    const { name, description, is_private, exercises } = req.body;

    const userId = req.user.id;

    const workout = await createWorkout(
      userId,
      name,
      description,
      is_private,
      exercises
    );

    res.json(workout.workout);
  } catch (err) {
    next(err);
  }
});

router.put(
  '/workouts/private/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const workoutId = req.params.id;
      const userId = req.user.id;
      const { name, description, is_private, exercises } = req.body;

      const workout = await updateUsersWorkout(
        userId,
        workoutId,
        name,
        description,
        is_private,
        exercises
      );

      res.json(workout.workout);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/workouts/private/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const workoutId = req.params.id;
      const userId = req.user.id;

      const workout = await deleteUsersWorkout(userId, workoutId);

      res.json(workout);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
