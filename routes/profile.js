const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/profileController');

router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profile = await getUserProfile(userId);

    res.json(profile.profile);
  } catch (err) {
    next(err);
  }
});

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
