const express = require('express');
const { body, validationResult } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error
 */
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
  async (req, res, next) => {
    try {
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
    } catch (err) {
      next(err);
    }
  }
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error
 */
router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email is required'),

    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const { token } = await loginUser({
        email: email.toLowerCase().trim(),
        password: password.trim(),
      });

      res.status(200).json({ message: 'Login successfull', token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
