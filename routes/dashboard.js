const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard welcome message
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the dashboard, johndoe
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', authenticateToken, (req, res, next) => {
  try {
    res.json({ message: `Welcome to the dashboard, ${req.user.username}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
