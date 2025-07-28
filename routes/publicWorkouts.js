const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

const {
  getAllPublicWorkouts,
  getPublicWorkoutById,
} = require('../controllers/workoutController');

/**
 * @swagger
 * /workouts/public:
 *   get:
 *     summary: Get all public workouts
 *     tags: [Public Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by workout name
 *     responses:
 *       200:
 *         description: List of public workouts
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
 *       401:
 *         description: Unauthorized
 */
router.get('/workouts/public', authenticateToken, async (req, res, next) => {
  try {
    const filters = req.query;
    const workouts = await getAllPublicWorkouts(filters);

    res.json(workouts.workouts);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /workouts/public/{id}:
 *   get:
 *     summary: Get a specific public workout by ID
 *     tags: [Public Workouts]
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
 *         description: Public workout details
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
router.get(
  '/workouts/public/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const workoutId = req.params.id;

      const workout = await getPublicWorkoutById(workoutId);

      res.json(workout.workout);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
