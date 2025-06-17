const db = require('../database/db');
const { buildExerciseFilterQuery } = require('../helpers/exerciseFilter');

// Users exercises
const getAllUsersExercises = async (userId, filters) => {
  let baseQuery = 'SELECT * FROM exercises WHERE created_by = $1';

  const { query, values } = buildExerciseFilterQuery(baseQuery, filters, 2);

  const finalQuery = query + ' ORDER BY name ASC';

  const result = await db.query(finalQuery, [userId, ...values]);

  return { exercises: result.rows };
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

  return { exercise: result.rows[0] };
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
       SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          muscle_group = COALESCE($4, muscle_group),
          difficulty = COALESCE($5, difficulty),
          is_private = COALESCE($6, is_private)
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

  return { message: 'Exercise deleted successfully' };
};

// All public exercises
const getAllPublicExercises = async (filters) => {
  let baseQuery = `
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
    `;

  const { query, values } = buildExerciseFilterQuery(baseQuery, filters);

  const finalQuery = query + ' ORDER BY name ASC';

  const result = await db.query(finalQuery, values);
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
