const db = require('../database/db');

const getUserWeightHistory = async (userId) => {
  const result = await db.query(
    `
            SELECT weight_kg, recorded_at
            FROM weight_history 
            WHERE user_id = $1
            ORDER BY recorded_at DESC 
        `,
    [userId]
  );

  return { weight: result.rows };
};

const logUserWeight = async (userId, weight_kg) => {
  const result = await db.query(
    `
            INSERT INTO weight_history (user_id, weight_kg)
            VALUES ($1, $2)
            RETURNING *
        `,
    [userId, weight_kg]
  );

  await db.query(
    `
            UPDATE users 
            SET weight_kg = $1
            WHERE id = $2 
        `,
    [weight_kg, userId]
  );

  return { weight: result.rows[0] };
};
module.exports = { getUserWeightHistory, logUserWeight };
