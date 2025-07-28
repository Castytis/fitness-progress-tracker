const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getUserWeightHistory,
  logUserWeight,
} = require('../controllers/weightController');

/**
 * @swagger
 * /weight/history:
 *   get:
 *     summary: Get the user's weight history
 *     tags: [Weight Tracking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of weight logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weight:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       weight_kg:
 *                         type: string
 *                         example: "90.00"
 *                       recorded_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/weight/history', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const weightHistory = await getUserWeightHistory(userId);

    res.json(weightHistory);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /weight:
 *   post:
 *     summary: Log a new weight for the user
 *     tags: [Weight Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight_kg:
 *                 type: number
 *                 example: 90.00
 *     responses:
 *       201:
 *         description: Weight log created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weight:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     user_id:
 *                       type: integer
 *                     weight_kg:
 *                       type: string
 *                       example: "90.00"
 *                     recorded_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/weight', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const newWeight = req.body.weight_kg;

    const weightLog = await logUserWeight(userId, newWeight);

    res.status(201).json(weightLog);
  } catch (err) {
    next(err);
  }
});

router, (module.exports = router);
