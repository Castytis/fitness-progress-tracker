const createCsvWriter = require('csv-writer').createObjectCsvStringifier;
const { getUsersWorkoutById } = require('../controllers/workoutController');
const {
  getFavoriteWorkouts,
} = require('../controllers/favoriteWorkoutController');

const exportFavoriteWorkouts = async (userId) => {
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

  return csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
};

module.exports = { exportFavoriteWorkouts };
