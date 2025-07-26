const db = require('../database/db');

const getProgressSummary = async (userId, startDate, endDate) => {
  const startPeriod = startDate ? new Date(startDate) : new Date(0);
  const endPeriod = endDate ? new Date(endDate) : new Date();

  const completedWorkouts = await db.query(
    `
        SELECT COUNT(*) 
        FROM workout_history 
        WHERE user_id = $1 
        AND completed_at >= $2
        AND completed_at <= $3
        `,
    [userId, startPeriod, endPeriod]
  );

  const listOfCompletedWorkouts = await db.query(
    `
        SELECT wh.id, wh.completed_at, w.name 
        FROM workout_history wh
        JOIN workouts w ON wh.workout_id = w.id
        WHERE wh.user_id = $1
        AND wh.completed_at >= $2
        AND wh.completed_at <= $3
        ORDER BY wh.completed_at DESC
    `,
    [userId, startPeriod, endPeriod]
  );

  const weightEntries = await db.query(
    `
        SELECT weight_kg, recorded_at
        FROM weight_history
        WHERE user_id = $1
        AND recorded_at >= $2
        AND recorded_at <= $3
        ORDER BY recorded_at ASC
    `,
    [userId, startPeriod, endPeriod]
  );

  return {
    completedWorkouts: completedWorkouts.rows[0].count,
    listOfCompletedWorkouts: listOfCompletedWorkouts.rows,
    weight: weightEntries.rows,
  };
};

module.exports = { getProgressSummary };
