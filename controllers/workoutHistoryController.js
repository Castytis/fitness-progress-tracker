const db = require('../database/db');

const getWorkoutHistory = async (userId) => {
  const workoutHistoryResult = await db.query(
    `
        SELECT wh.*, w.name
        FROM workout_history wh
        JOIN workouts w ON wh.workout_id = w.id
        WHERE wh.user_id = $1
        ORDER BY wh.completed_at DESC
    `,
    [userId]
  );

  const completedWorkouts = workoutHistoryResult.rows;

  for (const workout of completedWorkouts) {
    const exerciseHistoryResult = await db.query(
      `
            SELECT we.*, e.name
            FROM workout_exercises we
            JOIN exercises e ON we.exercise_id = e.id
            WHERE we.workout_id = $1
        `,
      [workout.workout_id]
    );
    workout.exercises = exerciseHistoryResult.rows;
  }

  return { workouts: completedWorkouts };
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
