const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getWorkoutHistory,
  logCompletedWorkout,
} = require('../controllers/workoutHistoryController');

/**
 * @swagger
 * /workouts/history:
 *   get:
 *     summary: Get the user's completed workout history
 *     tags: [Workout History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed workouts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   workout_id:
 *                     type: integer
 *                   completed_at:
 *                     type: string
 *                     format: date-time
 *                   notes:
 *                     type: string
 *                   name:
 *                     type: string
 *                   exercises:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         workout_id:
 *                           type: integer
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
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                         created_by:
 *                           type: integer
 *                         name:
 *                           type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/workouts/history', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const workoutHistory = await getWorkoutHistory(userId);

    res.json(workoutHistory.workouts);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /workouts/complete/{id}:
 *   post:
 *     summary: Log a completed workout for the user
 *     tags: [Workout History]
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Optional notes about the workout
 *     responses:
 *       201:
 *         description: Completed workout logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 workout_id:
 *                   type: integer
 *                 completed_at:
 *                   type: string
 *                   format: date-time
 *                 notes:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.post(
  '/workouts/complete/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const userId = req.user.id;
      const workoutId = req.params.id;
      const notes = req.body.notes;

      const completedWorkout = await logCompletedWorkout(
        userId,
        workoutId,
        notes
      );

      res.status(201).json(completedWorkout.workout);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
