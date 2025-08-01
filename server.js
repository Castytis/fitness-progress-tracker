const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const db = require('./database/db');

const errorHandler = require('./middleware/errorHandler.js');

const setupSwagger = require('./docs/swagger.js');
const authRouter = require('./routes/auth.js');
const dashboardRouter = require('./routes/dashboard.js');
const privateExercisesRouter = require('./routes/privateExercises.js');
const publicExercisesRouter = require('./routes/publicExercises.js');
const privateWorkoutsRouter = require('./routes/privateWorkouts.js');
const publicWorkoutsRouter = require('./routes/publicWorkouts.js');
const profileRouter = require('./routes/profile.js');
const weightRouter = require('./routes/weightTracking.js');
const workoutHistoryRouter = require('./routes/workoutHistory.js');
const favoriteWorkoutsRouter = require('./routes/favoriteWorkouts.js');
const progressRouter = require('./routes/progress.js');
const exportWorkoutsRouter = require('./routes/exportWorkouts.js');
const trainerChatRouter = require('./routes/trainerChat.js');

setupSwagger(app);
app.use(express.json());

app.use(authRouter);
app.use(dashboardRouter);
app.use(privateExercisesRouter);
app.use(publicExercisesRouter);
app.use(privateWorkoutsRouter);
app.use(publicWorkoutsRouter);
app.use(profileRouter);
app.use(weightRouter);
app.use(workoutHistoryRouter);
app.use(favoriteWorkoutsRouter);
app.use(progressRouter);
app.use(exportWorkoutsRouter);
app.use(trainerChatRouter);

app.use(errorHandler);

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
