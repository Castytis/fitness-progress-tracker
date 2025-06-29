const db = require('../database/db');

const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay() || 7;
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - day + 1);
  return now;
};

const calculateWeightChange = (weightEntries) => {
  if (weightEntries.length >= 2) {
    const first = Number(weightEntries[0].weight_kg);
    const last = Number(weightEntries[weightEntries.length - 1].weight_kg);
    return last - first;
  }
  return null;
};

const getProgressSummary = async (userId) => {
  const weekStart = getWeekStart();
  const completedWorkouts = await db.query(
    `
        SELECT COUNT(*) 
        FROM workout_history 
        WHERE user_id = $1 
        AND completed_at >= $2
        `,
    [userId, weekStart]
  );

  const listOfCompletedWorkouts = await db.query(
    `
        SELECT wh.id, wh.completed_at, w.name 
        FROM workout_history wh
        JOIN workouts w ON wh.workout_id = w.id
        WHERE wh.user_id = $1
        AND wh.completed_at >= $2
        ORDER BY wh.completed_at DESC
    `,
    [userId, weekStart]
  );

  const weightEntries = await db.query(
    `
        SELECT weight_kg, recorded_at
        FROM weight_history
        WHERE user_id = $1
        AND recorded_at >= $2
        ORDER BY recorded_at ASC
    `,
    [userId, weekStart]
  );

  const weeklyWeightChange = calculateWeightChange(weightEntries.rows);

  return {
    completedWorkouts: completedWorkouts.rows[0].count,
    listOfCompletedWorkouts: listOfCompletedWorkouts.rows,
    weeklyWeightChange,
  };
};

module.exports = { getProgressSummary };
