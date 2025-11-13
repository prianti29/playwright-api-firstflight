import { expect } from '@playwright/test';
import { ADMIN_LOGIN } from '../support/apiConstants.js';
import adminLoginData from '../fixtures/AUTH/adminLoginData.json';

async function super_admin_login(request, baseUrl) {
  const { email, password } = adminLoginData.jsonData[0];
  
  const response = await request.post(`${baseUrl}${ADMIN_LOGIN}`, {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  });

  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('accessToken');
  expect(responseBody).toHaveProperty('searchToken');

  const accessToken = responseBody.accessToken;
  process.env.SUPER_ADMIN_ACCESS_TOKEN = accessToken;
  return accessToken;
}

export { super_admin_login };