import { expect } from '@playwright/test';
import { ADMIN_LOGIN } from '../support/apiConstants.js';

const config = require('../playwright.config.js');
const BASE_URL = config.use?.BASE_URL;
const adminLoginData = require('../fixtures/adminLoginData.json');

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

  const superAdminAccessToken = responseBody.accessToken;
  process.env.SUPER_ADMIN_ACCESS_TOKEN = superAdminAccessToken;
  return superAdminAccessToken;
}

module.exports = { super_admin_login };