const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateToken, (req, res, next) => {
  try {
    res.json({ message: `Welcome to the dashboard, ${req.user.username}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
