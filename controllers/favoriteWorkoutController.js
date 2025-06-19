const db = require('../database/db');

const getFavoriteWorkouts = async (userId) => {
  const result = await db.query(
    `SELECT w.*
     FROM favorite_workouts fw
     JOIN workouts w on fw.workout_id = w.id
     WHERE fw.user_id = $1
     ORDER BY fw.created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

const addFavoriteWorkout = async (userId, workoutId) => {
  const result = await db.query(
    `INSERT INTO favorite_workouts (user_id, workout_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, workout_id) DO NOTHING
     RETURNING *
    `,
    [userId, workoutId]
  );

  return result.rows[0];
};

const removeFavoriteWorkout = async (userId, workoutId) => {
  await db.query(
    `DELETE FROM favorite_workouts 
     WHERE user_id = $1
     AND workout_id = $2
    `,
    [userId, workoutId]
  );

  return { message: 'Workout unfavorited' };
};

module.exports = {
  getFavoriteWorkouts,
  addFavoriteWorkout,
  removeFavoriteWorkout,
};
