const db = require('../database/db');

const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay() || 7;
  now.setHours(0, 0, 0, 0);
  now.setDate(now.getDate() - day + 1);
  return now;
};

const getProgressSummary = async (userId) => {
  const weekStart = getWeekStart();
  const weekResult = await db.query(
    `
        SELECT COUNT(*) 
        FROM workout_history 
        WHERE user_id = $1 
        AND completed_at >= $2
        `,
    [userId, weekStart]
  );

  return {
    completedWorkouts: weekResult.rows[0].count,
  };
};

module.exports = { getProgressSummary };
