const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
} = require('../controllers/profileController');

router.get('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const profile = await getUserProfile(userId);

  res.json(profile.profile);
});

router.put('/profile', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const profileData = req.body;

  const updatedProfile = await updateUserProfile(userId, profileData);

  res.json(updatedProfile.profile);
});

module.exports = router;
