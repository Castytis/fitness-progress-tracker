const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/profileController');

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 weight_kg:
 *                   type: number
 *                 height_cm:
 *                   type: number
 *                 target_weight_kg:
 *                   type: number
 *                 fitness_level:
 *                   type: string
 *                 weekly_goal:
 *                   type: integer
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await getUserProfile(userId);

    res.json(profile.profile);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               weight_kg:
 *                 type: number
 *               height_cm:
 *                 type: number
 *               target_weight_kg:
 *                 type: number
 *               fitness_level:
 *                 type: string
 *               weekly_goal:
 *                 type: integer
 *               date_of_birth:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Updated user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 weight_kg:
 *                   type: number
 *                 height_cm:
 *                   type: number
 *                 target_weight_kg:
 *                   type: number
 *                 fitness_level:
 *                   type: string
 *                 weekly_goal:
 *                   type: integer
 *                 date_of_birth:
 *                   type: string
 *                   format: date
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    const updatedProfile = await updateUserProfile(userId, profileData);

    res.json(updatedProfile.profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
