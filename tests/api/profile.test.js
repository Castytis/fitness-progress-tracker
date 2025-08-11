const { test, expect, request } = require('@playwright/test');
const { baseURL } = require('../helpers/constants');
const { getTestUser } = require('../helpers/testUser');

test.describe('User profile', () => {
  let apiContext;
  let token, email, username;

  test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL });
    const user = await getTestUser(baseURL);
    token = user.token;
    (email = user.email), (username = user.username);
  });

  test('Should get user profile', async () => {
    const res = await apiContext.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('username', username);
    expect(body).toHaveProperty('email', email);
  });

  test('Should update user profile', async () => {
    const updatedProfile = {
      username: `updated+${username}`,
      weight_kg: 80,
      height_cm: 180,
      target_weight_kg: 75.0,
      fitness_level: 'Beginner',
      weekly_goal: 4,
    };

    const res = await apiContext.put('/profile', {
      headers: { Authorization: `Bearer ${token}` },
      data: updatedProfile,
    });
    const body = await res.json();
    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('username', updatedProfile.username);
    expect(Number(body.weight_kg)).toBe(Number(updatedProfile.weight_kg));
    expect(Number(body.height_cm)).toBe(Number(updatedProfile.height_cm));
    expect(Number(body.target_weight_kg)).toBe(
      Number(updatedProfile.target_weight_kg)
    );
    expect(body).toHaveProperty('fitness_level', updatedProfile.fitness_level);
    expect(body).toHaveProperty('weekly_goal', updatedProfile.weekly_goal);
  });
});
