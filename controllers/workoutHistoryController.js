const db = require('../database/db');

const getWorkoutHistory = async (userId) => {
  const result = await db.query();
};

const logCompletedWorkout = async (userId, workoutId, notes) => {
  const result = await db.query(
    `
        INSERT INTO workout_history (user_id, workout_id, notes)
        VALUES ($1, $2, $3)
        RETURNING *        
    `,
    [userId, workoutId, notes]
  );

  return { workout: result.rows[0] };
};

module.exports = { getWorkoutHistory, logCompletedWorkout };
