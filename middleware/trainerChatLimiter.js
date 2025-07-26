const rateLimit = require('express-rate-limit');

const trainerChatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, try again later.' },
  keyGenerator: (req) => req.user.id,
});

module.exports = trainerChatLimiter;
