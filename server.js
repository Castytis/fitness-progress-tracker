const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
const db = require('./database/db');
const authRouter = require('./routes/auth.js');
const dashboardRouter = require('./routes/dashboard.js');
const personalWorkoutsRouter = require('./routes/personalWorkouts.js');
const publicWorkoutsRouter = require('./routes/publicWorkouts.js');

app.use(express.json());
app.use(authRouter);
app.use(dashboardRouter);
app.use(personalWorkoutsRouter);
app.use(publicWorkoutsRouter);

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      message: 'Database connection successful',
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Database connection failed');
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
});
