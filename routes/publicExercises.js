const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const db = require('../database/db');

const {
  getAllPublicExercises,
  getPublicExerciseById,
} = require('../controllers/exercisesController.js');

/**
 * @swagger
 * /exercises/public:
 *   get:
 *     summary: Get all public exercises
 *     tags: [Public Exercises]
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
 *         description: List of public exercises
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
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/exercises/public', authenticateToken, async (req, res, next) => {
  try {
    const filters = req.query;
    const exercises = await getAllPublicExercises(filters);

    res.json(exercises.exercises);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /exercises/public/{id}:
 *   get:
 *     summary: Get a specific public exercise by ID
 *     tags: [Public Exercises]
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
 *         description: Public exercise details
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
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.get(
  '/exercises/public/:id',
  authenticateToken,
  async (req, res, next) => {
    try {
      const exerciseId = req.params.id;

      const exercise = await getPublicExerciseById(exerciseId);

      res.json(exercise.exercise);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
