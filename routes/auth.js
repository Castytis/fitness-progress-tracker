const express = require('express');

const { body, validationResult } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

router.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),

    body('username')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    const { token } = await registerUser({
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password: password.trim(),
    });

    res.status(201).json({ message: 'User registered successfully', token });
  }
);

router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email is required'),

    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const { token } = await loginUser({
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });

    res.status(201).json({ message: 'Login successfull', token });
  }
);

module.exports = router;
