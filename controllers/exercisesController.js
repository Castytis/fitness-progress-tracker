const db = require('../database/db');

// Users exercises
const getAllUsersExercises = async (userId) => {
  const result = await db.query(
    'SELECT * FROM exercises WHERE created_by = $1',
    [userId]
  );

  return { exercise: result.rows };
};

const getUsersExerciseById = async (userId, exerciseId) => {
  const result = await db.query(
    'SELECT * FROM exercises WHERE created_by = $1 AND id = $2',
    [userId, exerciseId]
  );

  if (!result.rows[0]) {
    const error = new Error('Exercise not found');
    error.statusCode = 404;
    throw error;
  }

  return { exercises: result.rows[0] };
};

const createExercise = async (
  userId,
  name,
  description,
  category,
  muscle_group,
  difficulty,
  is_private
) => {
  const result = await db.query(
    `INSERT INTO exercises 
        (created_by, name, description, category, muscle_group, difficulty, is_private) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [userId, name, description, category, muscle_group, difficulty, is_private]
  );

  return { exercise: result.rows[0] };
};

const updateUsersExercise = async (
  userId,
  name,
  description,
  category,
  muscle_group,
  difficulty,
  is_private,
  exerciseId
) => {
  const result = await db.query(
    `UPDATE exercises
       SET name = $1,
           description = $2,
           category = $3,
           muscle_group = $4,
           difficulty = $5,
           is_private = $6
       WHERE id = $7 AND created_by = $8
       RETURNING *`,
    [
      name,
      description,
      category,
      muscle_group,
      difficulty,
      is_private,
      exerciseId,
      userId,
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error('Exercise not found');
    error.statusCode = 404;
    throw error;
  }

  return { exercise: result.rows[0] };
};

const deleteUsersExercise = async (userId, exerciseId) => {
  const result = await db.query(
    `DELETE FROM exercises WHERE created_by = $1 AND id = $2 RETURNING *`,
    [userId, exerciseId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Exercise not found');
    error.statusCode = 404;
    throw error;
  }

  return { exercise: result.rows[0] };
};

// All public exercises
const getAllPublicExercises = async () => {
  const result = await db.query(`
      SELECT 
        id,
        name,
        description,
        category,
        muscle_group,
        difficulty,
        is_private,
        created_at
      FROM exercises 
      WHERE is_private = false
    `);

  return { exercises: result.rows };
};

const getPublicExerciseById = async (exerciseId) => {
  const result = await db.query(
    `
      SELECT 
        id,
        name,
        description,
        category,
        muscle_group,
        difficulty,
        is_private,
        created_at
      FROM exercises 
      WHERE is_private = false 
      AND id = $1
      `,
    [exerciseId]
  );

  if (!result.rows.length) {
    const error = new Error('Exercise not found');
    error.statusCode = 404;
    throw error;
  }

  return { exercise: result.rows[0] };
};

module.exports = {
  getAllUsersExercises,
  getUsersExerciseById,
  createExercise,
  updateUsersExercise,
  deleteUsersExercise,
  getAllPublicExercises,
  getPublicExerciseById,
};
