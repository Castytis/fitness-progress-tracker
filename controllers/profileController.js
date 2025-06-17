const db = require('../database/db');

const getUserProfile = async (userId) => {
  const result = await db.query(
    `SELECT 
        id,
        username,
        email,
        weight_kg,
        height_cm,
        target_weight_kg,
        fitness_level,
        weekly_goal,
        date_of_birth,
        created_at
        FROM users
        WHERE id = $1`,
    [userId]
  );

  return { profile: result.rows[0] };
};

const updateUserProfile = async (userId, profileData) => {
  const {
    username,
    weight_kg,
    height_cm,
    target_weight_kg,
    fitness_level,
    weekly_goal,
    date_of_birth,
  } = profileData;

  const result = await db.query(
    `UPDATE users 
     SET 
         username = COALESCE($1, username),
         weight_kg = COALESCE($2, weight_kg),
         height_cm = COALESCE($3, height_cm),
         target_weight_kg = COALESCE($4, target_weight_kg),
         fitness_level = COALESCE($5, fitness_level),
         weekly_goal = COALESCE($6, weekly_goal),
         date_of_birth = COALESCE($7, date_of_birth)
     WHERE id = $8
     RETURNING *`,
    [
      username,
      weight_kg,
      height_cm,
      target_weight_kg,
      fitness_level,
      weekly_goal,
      date_of_birth,
      userId,
    ]
  );

  return { profile: result.rows[0] };
};

module.exports = { getUserProfile, updateUserProfile };
