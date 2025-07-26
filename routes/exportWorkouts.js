const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

const {
  getFavoriteWorkouts,
} = require('../controllers/favoriteWorkoutController');

const { getUsersWorkoutById } = require('../controllers/workoutController');

router.get(
  '/workouts/favorite/export/csv',
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.id;

      const favoriteWorkouts = await getFavoriteWorkouts(userId);

      let records = [];
      for (const workout of favoriteWorkouts) {
        const workoutDetails = await getUsersWorkoutById(userId, workout.id);

        workoutDetails.workout.exercises.forEach((ex, idx) => {
          records.push({
            workout_name: idx === 0 ? workout.name : '',
            workout_description: idx === 0 ? workout.description : '',
            exercise_name: ex.exercise_name,
            sets: ex.sets || '-',
            reps: ex.reps || '-',
            duration: ex.duration_minutes || '-',
          });
        });

        records.push({});
      }

      const csvWriter = createCsvWriter({
        header: [
          { id: 'workout_name', title: 'Workout Name' },
          { id: 'workout_description', title: 'Workout Description' },
          { id: 'exercise_name', title: 'Exercise Name' },
          { id: 'sets', title: 'Sets' },
          { id: 'reps', title: 'Reps' },
          { id: 'duration', title: 'Duration' },
        ],
      });

      const csv =
        csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="favorite_workouts.csv"'
      );
      res.send(csv);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
