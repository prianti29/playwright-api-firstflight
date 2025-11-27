import { expect } from '@playwright/test';
import { ADMIN_LOGIN } from '../support/apiConstants.js';
import config from '../playwright.config.js';
import adminLoginData from '../fixtures/AUTH/adminLoginData.json' assert { type: 'json' };

const BASE_URL = config.use?.BASE_URL;

async function super_admin_login(request, baseUrl = BASE_URL) {
  const { email, password } = adminLoginData.jsonData[0];

  const response = await request.post(`${baseUrl}${ADMIN_LOGIN}`, {
    data: { email, password },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();
  expect(responseBody).toEqual(
    expect.objectContaining({
      accessToken: expect.any(String),
      searchToken: expect.any(String),
    }),
  );

  const accessToken = responseBody.accessToken;
  process.env.SUPER_ADMIN_ACCESS_TOKEN = accessToken;
  return accessToken;
}

export { super_admin_login };