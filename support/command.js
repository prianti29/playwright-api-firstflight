import { expect } from '@playwright/test';
import { ADMIN_LOGIN, SELLER_SIGNIN, SELLER_SIGNIN_FOR_STORE, ADMINS, FILES_PROFILES } from '../support/apiConstants.js';
import adminLoginData from '../fixtures/AUTH/adminLoginData.js';
import sellerSignInData from '../fixtures/AUTH/sellerSignInData.js';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { BASE_URL } from '../playwright.config.js';

// BASE_URL is now centralized in playwright.config.js

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

async function current_admin_login(request, baseUrl = BASE_URL, credentials = null) {
  // Use existing admin credentials or provided ones
  const { email, password } = credentials || adminLoginData.jsonData[8];

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
  process.env.CURRENT_ADMIN_ACCESS_TOKEN = accessToken;
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

async function default_seller_signin_for_update(request, baseUrl = BASE_URL) {
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

async function create_admin(request, baseUrl = BASE_URL, adminData = null) {
  const data = adminData || {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    designation: faker.person.jobTitle(),
    permissions: ["admins_read", "admins_write"]
  };

  const response = await request.post(`${baseUrl}${ADMINS}`, {
    data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
    },
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      designation: expect.any(String),
      email: expect.any(String),
      permissions: expect.any(Array),
      isActive: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  );

  return responseBody;
}

async function create_admin_without_permissions(request, baseUrl = BASE_URL, adminData = null) {
  const data = adminData || {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 8 }),
    designation: faker.person.jobTitle(),
    permissions: ["files_read"]
  };

  const response = await request.post(`${baseUrl}${ADMINS}`, {
    data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
    },
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();
  expect(responseBody).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      designation: expect.any(String),
      email: expect.any(String),
      permissions: expect.any(Array),
      isActive: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  );

  // Login as the created admin to get access token
  const loginResponse = await request.post(`${baseUrl}${ADMIN_LOGIN}`, {
    data: { email: responseBody.email, password: data.password },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  expect(loginResponse.ok()).toBeTruthy();
  const loginBody = await loginResponse.json();
  const accessToken = loginBody.accessToken;

  // Return both admin data and access token
  return {
    ...responseBody,
    accessToken: accessToken
  };
}

async function delete_admin(request, adminId, baseUrl = BASE_URL, token = null) {
  const response = await request.delete(`${baseUrl}${ADMINS}/${adminId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
    },
  });

  expect(response.status()).toBe(200);

  // Return response body if available, otherwise null
  const responseText = await response.text();
  if (responseText && responseText.trim() !== '') {
    return JSON.parse(responseText);
  }
  return null;
}

async function upload_profile_file(request, filePath, baseUrl = BASE_URL, token = null) {
  // Read the file
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  // Create FormData for file upload
  const formData = new FormData();
  const blob = new Blob([fileBuffer]);
  formData.append('file', blob, fileName);

  const response = await request.post(`${baseUrl}${FILES_PROFILES}`, {
    multipart: {
      file: {
        name: fileName,
        mimeType: 'application/octet-stream',
        buffer: fileBuffer,
      },
    },
    headers: {
      Authorization: `Bearer ${token || process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
    },
  });

  expect(response.ok()).toBeTruthy();

  const responseBody = await response.json();

  // Extract file ID from response (adjust field name based on actual API response)
  const fileId = responseBody.id || responseBody.fileId || responseBody.data?.id;

  if (fileId) {
    // Save file ID to environment variable
    process.env.PROFILE_FILE_ID = fileId;
  }

  return responseBody;
}

export { super_admin_login, default_seller_signin, seller_signin_for_staff_store, create_admin, create_admin_without_permissions, current_admin_login, delete_admin, upload_profile_file };
export { };