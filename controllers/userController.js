const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const registerUser = async ({ email, username, password }) => {
  if (!email || !username || !password) {
    const error = new Error('Email, username, and password are required');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await db.query(
    'SELECT * FROM users WHERE email = $1 OR username = $2',
    [email, username]
  );

  if (existingUser.rows.length > 0) {
    const error = new Error('Username or email already exists');
    error.statusCode = 400;
    throw error;
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
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  return { token };
};

const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  if (userResult.rows.length === 0) {
    const error = new Error('Invalid email or password');
    error.statusCode = 400;
    throw error;
  }

  const user = userResult.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );

  return { token };
};

module.exports = { registerUser, loginUser };
