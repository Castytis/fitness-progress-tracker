const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllUsersExercises,
  getUsersExerciseById,
  createExercise,
  updateUsersExercise,
  deleteUsersExercise,
} = require('../controllers/exercisesController');

/**
 * @swagger
 * /exercises/user:
 *   get:
 *     summary: Get all exercises created by the authenticated user
 *     tags: [User Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by exercise category
 *       - in: query
 *         name: muscle_group
 *         schema:
 *           type: string
 *         description: Filter by muscle group
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *         description: Filter by difficulty
 *     responses:
 *       200:
 *         description: List of user exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   muscle_group:
 *                     type: string
 *                   difficulty:
 *                     type: string
 *                   is_private:
 *                     type: boolean
 *                   created_by:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/exercises/user', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const exercises = await getAllUsersExercises(userId, filters);

    res.json(exercises.exercises);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /exercises/user/{id}:
 *   get:
 *     summary: Get a specific exercise created by the authenticated user
 *     tags: [User Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: User exercise details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 muscle_group:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                 is_private:
 *                   type: boolean
 *                  created_by:
 *                     type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.get('/exercises/user/:id', authenticateToken, async (req, res, next) => {
  try {
    const exerciseId = req.params.id;
    const userId = req.user.id;

    const exercise = await getUsersExerciseById(userId, exerciseId);

    res.json(exercise.exercise);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /exercises/user:
 *   post:
 *     summary: Create a new exercise for the authenticated user
 *     tags: [User Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               muscle_group:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               is_private:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Exercise created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 muscle_group:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                 is_private:
 *                   type: boolean
 *                 created_by:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/exercises/user', authenticateToken, async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      muscle_group,
      difficulty,
      is_private,
    } = req.body;

    const userId = req.user.id;

    const exercise = await createExercise(
      userId,
      name,
      description,
      category,
      muscle_group,
      difficulty,
      is_private
    );

    res.json(exercise.exercise);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /exercises/user/{id}:
 *   put:
 *     summary: Update an exercise created by the authenticated user
 *     tags: [User Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               muscle_group:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               is_private:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Exercise updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 muscle_group:
 *                   type: string
 *                 difficulty:
 *                   type: string
 *                 is_private:
 *                   type: boolean
 *                 created_by:
 *                   type: integer
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.put('/exercises/user/:id', authenticateToken, async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      muscle_group,
      difficulty,
      is_private,
    } = req.body;

    const exerciseId = req.params.id;
    const userId = req.user.id;

    const exercise = await updateUsersExercise(
      userId,
      name,
      description,
      category,
      muscle_group,
      difficulty,
      is_private,
      exerciseId
    );

    res.json(exercise.exercise);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /exercises/user/{id}:
 *   delete:
 *     summary: Delete an exercise created by the authenticated user
 *     tags: [User Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *     responses:
 *       200:
 *         description: Exercise deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */

router.delete(
  '/exercises/user/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const exerciseId = req.params.id;
      const userId = req.user.id;

      const exercise = await deleteUsersExercise(userId, exerciseId);

      res.json(exercise);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
