import { test as base, expect } from '@playwright/test';
import { ADMIN_LOGIN } from '../support/apiConstants.js';
import { fixtureData } from '../fixtures/adminLoginData.json';

const config = require('../playwright.config.js');
const BASE_URL = config.use?.BASE_URL;


async function super_admin_login(request, baseUrl) {

  const adminLoginData = require('../fixtures/adminLoginData.json');
  const data = adminLoginData.jsonData[0];
  console.log('Admin Login Data:', data);
  const response = await request.post(`${baseUrl}${ADMIN_LOGIN}`, {
    data: {
      email: data.email,
      password: data.password,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const responseBody = await response.json();
  console.log('Response body:', responseBody);
  expect(responseBody).toHaveProperty('accessToken');
  expect(responseBody).toHaveProperty('searchToken');

  const superAdminAccessToken = responseBody.accessToken;
  process.env.SUPER_ADMIN_ACCESS_TOKEN = superAdminAccessToken;
  return superAdminAccessToken;
}

module.exports = { super_admin_login };