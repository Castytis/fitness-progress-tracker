const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware.js');

const {
  getAllUsersWorkouts,
  getUsersWorkoutById,
  createWorkout,
  updateUsersWorkout,
  deleteUsersWorkout,
} = require('../controllers/workoutController.js');

/**
 * @swagger
 * /workouts/user:
 *   get:
 *     summary: Get all workouts created by the user
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user workouts
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
 *                   is_private:
 *                     type: boolean
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   created_by:
 *                     type: integer
 *                   exercises:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         exercise_id:
 *                           type: integer
 *                         sets:
 *                           type: integer
 *                           nullable: true
 *                         reps:
 *                           type: integer
 *                           nullable: true
 *                         duration_minutes:
 *                           type: integer
 *                           nullable: true
 *                         notes:
 *                           type: string
 *                           nullable: true
 *       401:
 *         description: Unauthorized
 */
router.get('/workouts/user', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = req.query;

    const workouts = await getAllUsersWorkouts(userId, filters);

    res.json(workouts.workouts);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /workouts/user/{id}:
 *   get:
 *     summary: Get a specific workout created by the user
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: User workout details
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
 *                 is_private:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 created_by:
 *                   type: integer
 *                 exercises:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       exercise_id:
 *                         type: integer
 *                       sets:
 *                         type: integer
 *                         nullable: true
 *                       reps:
 *                         type: integer
 *                         nullable: true
 *                       duration_minutes:
 *                         type: integer
 *                         nullable: true
 *                       notes:
 *                         type: string
 *                         nullable: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.get('/workouts/user/:id', authenticateToken, async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user.id;

    const workout = await getUsersWorkoutById(userId, workoutId);

    res.json(workout.workout);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /workouts/user:
 *   post:
 *     summary: Create a new workout for the user
 *     tags: [User Workouts]
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
 *               is_private:
 *                 type: boolean
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise_id:
 *                       type: integer
 *                     sets:
 *                       type: integer
 *                       nullable: true
 *                     reps:
 *                       type: integer
 *                       nullable: true
 *                     duration_minutes:
 *                       type: integer
 *                       nullable: true
 *                     notes:
 *                       type: string
 *                       nullable: true
 *     responses:
 *       201:
 *         description: Workout created
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
 *                 is_private:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 created_by:
 *                   type: integer
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/workouts/user', authenticateToken, async (req, res, next) => {
  try {
    const { name, description, is_private, exercises } = req.body;

    const userId = req.user.id;

    const workout = await createWorkout(
      userId,
      name,
      description,
      is_private,
      exercises
    );

    res.json(workout.workout);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /workouts/user/{id}:
 *   put:
 *     summary: Update a workout created by the user
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
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
 *               is_private:
 *                 type: boolean
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise_id:
 *                       type: integer
 *                     sets:
 *                       type: integer
 *                       nullable: true
 *                     reps:
 *                       type: integer
 *                       nullable: true
 *                     duration_minutes:
 *                       type: integer
 *                       nullable: true
 *                     notes:
 *                       type: string
 *                       nullable: true
 *     responses:
 *       200:
 *         description: Workout updated
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
 *                 is_private:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 created_by:
 *                   type: integer
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.put('/workouts/user/:id', authenticateToken, async (req, res, next) => {
  try {
    const workoutId = req.params.id;
    const userId = req.user.id;
    const { name, description, is_private, exercises } = req.body;

    const workout = await updateUsersWorkout(
      userId,
      workoutId,
      name,
      description,
      is_private,
      exercises
    );

    res.json(workout.workout);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /workouts/user/{id}:
 *   delete:
 *     summary: Delete a workout created by the user
 *     tags: [User Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Workout deleted
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
 *         description: Workout not found
 */
router.delete(
  '/workouts/user/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const workoutId = req.params.id;
      const userId = req.user.id;

      const workout = await deleteUsersWorkout(userId, workoutId);

      res.json(workout);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
