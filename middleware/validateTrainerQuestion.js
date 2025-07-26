const validateTrainerQuestion = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body is required.' });
  }
  const { question } = req.body;
  if (
    !question ||
    typeof question !== 'string' ||
    question.trim().length === 0
  ) {
    return res.status(400).json({ error: 'Please, enter your question.' });
  }
  next();
};

module.exports = validateTrainerQuestion;
