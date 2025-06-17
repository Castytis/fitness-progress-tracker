const db = require('../database/db');
const { buildWorkoutFilterQuery } = require('../helpers/workoutFilter');

// Users exercises
const getAllUsersWorkouts = async (userId, filters = {}) => {
  let baseQuery = `SELECT * FROM workouts WHERE created_by = $1`;

  const { query, values } = buildWorkoutFilterQuery(baseQuery, filters, 2);
  const finalQuery = query + ' ORDER BY name ASC NULLS LAST';

  const result = await db.query(finalQuery, [userId, ...values]);

  if (result.rows.length === 0) {
    return { workouts: [] };
  }

  const workouts = result.rows;
  for (const workout of workouts) {
    const exercisesResult = await db.query(
      `SELECT exercise_id, sets, reps, duration_minutes, notes FROM workout_exercises WHERE workout_id = $1`,
      [workout.id]
    );
    workout.exercises = exercisesResult.rows;
  }

  return { workouts: workouts };
};

const getUsersWorkoutById = async (userId, workoutId) => {
  const result = await db.query(
    `SELECT * FROM workouts WHERE id = $1 AND created_by = $2`,
    [workoutId, userId]
  );

  if (result.rows.length === 0) {
    return { workouts: [] };
  }

  const exercisesResult = await db.query(
    `SELECT exercise_id, sets, reps, duration_minutes, notes FROM workout_exercises WHERE workout_id = $1`,
    [workoutId]
  );

  const workout = result.rows[0];
  workout.exercises = exercisesResult.rows;

  return { workout: result.rows[0] };
};

const createWorkout = async (
  userId,
  name,
  description,
  is_private,
  exercises
) => {
  const result = await db.query(
    `
        INSERT INTO workouts 
        (created_by, name, description, is_private) 
        VALUES ($1, $2, $3, $4) RETURNING *
    `,
    [userId, name, description, is_private]
  );

  const workoutId = result.rows[0].id;

  for (const exercise of exercises) {
    await db.query(
      `
            INSERT INTO workout_exercises (created_by, workout_id, exercise_id, sets, reps, duration_minutes, notes) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
      [
        userId,
        workoutId,
        exercise.exercise_id,
        exercise.sets,
        exercise.reps,
        exercise.duration_minutes,
        exercise.notes,
      ]
    );
  }

  return { workout: result.rows[0] };
};

const updateUsersWorkout = async (
  userId,
  workoutId,
  name,
  description,
  is_private,
  exercises
) => {
  const result = await db.query(
    `
        UPDATE workouts 
        SET 
          name = COALESCE($1, name),  
          description = COALESCE($2, description), 
          is_private = COALESCE($3, is_private) 
        WHERE id = $4 AND created_by = $5
        RETURNING *
      `,
    [name, description, is_private, workoutId, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Workout not found');
    error.statusCode = 404;
    throw error;
  }

  if (Array.isArray(exercises) && exercises.length > 0) {
    await db.query(`DELETE FROM workout_exercises WHERE workout_id = $1`, [
      workoutId,
    ]);

    for (const exercise of exercises) {
      await db.query(
        `
          INSERT INTO workout_exercises (created_by, workout_id, exercise_id, sets, reps, duration_minutes, notes) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          userId,
          workoutId,
          exercise.exercise_id,
          exercise.sets,
          exercise.reps,
          exercise.duration_minutes,
          exercise.notes,
        ]
      );
    }
  }

  return { workout: result.rows[0] };
};

const deleteUsersWorkout = async (userId, workoutId) => {
  const result = await db.query(
    `DELETE FROM workouts WHERE id=$1 AND created_by=$2 RETURNING *`,
    [workoutId, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error('Workout not found');
    error.statusCode = 404;
    throw error;
  }

  await db.query(`DELETE FROM workout_exercises WHERE workout_id = $1`, [
    workoutId,
  ]);

  return { message: 'Workout deleted successfully' };
};

// All public workouts
const getAllPublicWorkouts = async (filters) => {
  const baseQuery = `SELECT * FROM workouts WHERE is_private = false`;

  const { query, values } = buildWorkoutFilterQuery(baseQuery, filters);

  const finalQuery = query + ' ORDER BY name ASC';

  const result = await db.query(finalQuery, values);

  return { workouts: result.rows };
};

const getPublicWorkoutById = async (workoutId) => {
  const result = await db.query(
    `SELECT * FROM workouts WHERE id = $1 AND is_private = false`,
    [workoutId]
  );

  const exercisesResult = await db.query(
    `SELECT exercise_id, sets, reps, duration_minutes, notes FROM workout_exercises WHERE workout_id = $1`,
    [workoutId]
  );

  const workout = result.rows[0];
  workout.exercises = exercisesResult.rows;

  return { workout: result.rows[0] };
};

module.exports = {
  getAllUsersWorkouts,
  getUsersWorkoutById,
  createWorkout,
  updateUsersWorkout,
  deleteUsersWorkout,
  getAllPublicWorkouts,
  getPublicWorkoutById,
};
