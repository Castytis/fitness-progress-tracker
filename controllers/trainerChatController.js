const { OpenAI } = require('openai');
const { getUserProfile } = require('./profileController');
const calculateAge = require('../helpers/calculateUserAge');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const askTrainer = async (question, userId) => {
  const { profile } = await getUserProfile(userId);
  const age = calculateAge(profile.date_of_birth);

  const context = `
  User profile:
  Username: ${profile.username},
  Current weight: ${profile.weight_kg} kg,
  Target weight: ${profile.target_weight_kg} kg,
  Height: ${profile.height_cm} cm,
  Weekly goal: ${profile.weekly_goal} workouts a week,
  Age: ${age} years old.
  `;

  const completion = await client.chat.completions.create({
    model: 'gpt-4.1-nano',
    messages: [
      {
        role: 'system',
        content: `You are a professional fitness trainer. Use the following user profile to personalize your advice. ${context}`,
      },
      { role: 'user', content: question },
    ],
  });

  return completion.choices[0].message.content;
};

module.exports = { askTrainer };
