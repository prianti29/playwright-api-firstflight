import { expect } from '@playwright/test';
import { ADMIN_LOGIN, SELLER_SIGNIN, SELLER_SIGNIN_FOR_STORE } from '../support/apiConstants.js';
import config from '../playwright.config.js';
import adminLoginData from '../fixtures/AUTH/adminLoginData.js';
import sellerSignInData from '../fixtures/AUTH/sellerSignIn.js';

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

async function default_seller_signin(request, baseUrl = BASE_URL) {
  const { email, password } = sellerSignInData.jsonData[0];

  const response = await request.post(`${baseUrl}${SELLER_SIGNIN}`, {
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
  process.env.SELLER_ACCESS_TOKEN = accessToken;
  return accessToken;
}

async function seller_signin_for_staff_store(request, baseUrl = BASE_URL) {
  const storeId = 'gsso0e05ljljvf3jafnzfd51';
  const { email, password } = sellerSignInData.jsonData[0];

  const response = await request.post(`${baseUrl}${SELLER_SIGNIN_FOR_STORE}/${storeId}`, {
    data: { email, password },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SELLER_ACCESS_TOKEN}`,
    },
  });
  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();
  // console.log('responseBody:', responseBody);
  expect(responseBody).toEqual(
    expect.objectContaining({
      accessToken: expect.any(String),
      searchToken: expect.any(String),
    }),
  );

  const accessToken = responseBody.accessToken;
  process.env.SELLER_STORE_ACCESS_TOKEN = accessToken;
  return accessToken;
}

export { super_admin_login, default_seller_signin, seller_signin_for_staff_store };