const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const {
  getUserWeightHistory,
  logUserWeight,
} = require('../controllers/weightController');

router.get('/weight/history', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const weightHistory = await getUserWeightHistory(userId);

    res.json(weightHistory);
  } catch (err) {
    next(err);
  }
});

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
