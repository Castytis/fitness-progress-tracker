const { test, expect, request } = require('@playwright/test');
const { baseURL } = require('../helpers/constants');

test.describe('Auth', () => {
  let apiContext;
  const newUser = Date.now();
  const email = `user${newUser}@test.com`;
  const username = `user${newUser}`;
  const password = '@Password123';

  test.beforeAll(async () => {
    apiContext = await request.newContext({ baseURL });
  });

  test('Should register a new user with valid credentials', async () => {
    const res = await apiContext.post('/register', {
      data: { email, username, password },
    });

    const body = await res.json();
    expect(res.status()).toBe(201);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('message', 'User registered successfully');
  });

  test('Should login a user with valid credentials', async () => {
    const res = await apiContext.post('/login', {
      data: { email, password },
    });

    const body = await res.json();
    expect(res.status()).toBe(200);
    expect(body).toHaveProperty('token');
    expect(body).toHaveProperty('message', 'Login successfull');
  });
});
