const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../database/db');
const jwt = require('jsonwebtoken');

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

    try {
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        return res
          .status(400)
          .json({ message: 'Username or email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.query(
        'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *',
        [email, username, hashedPassword]
      );

      const user = newUser.rows[0];

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
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
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const userResult = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [normalizedEmail]
      );

      if (userResult.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const user = userResult.rows[0];

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
