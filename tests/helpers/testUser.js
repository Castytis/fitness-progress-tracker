const { request } = require('@playwright/test');

let cachedUser = null;

const getTestUser = async (baseURL) => {
  if (cachedUser) return cachedUser;

  const apiContext = await request.newContext({ baseURL });
  const newUser = Date.now();
  const email = `user${newUser}@test.com`;
  const username = `user${newUser}`;
  const password = '@Password123';

  const res = await apiContext.post('/register', {
    data: { email, username, password },
  });
  const { token } = await res.json();

  cachedUser = { email, username, password, token };
  return cachedUser;
};

module.exports = { getTestUser };
