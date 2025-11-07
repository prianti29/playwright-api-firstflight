import { test, expect } from "@playwright/test";
import { ADMIN_LOGIN } from "../../support/apiConstants.js";
import { super_admin_login } from "../../support/command.js";

const fixtureData = require("../../fixtures/adminLoginData.json");

const config = require("../../playwright.config.js");
const BASE_URL = config.use?.BASE_URL;

test.describe("Admin Login Tests", () => {

  // 1.1
  test("Valid Email and Password", async ({ request }) => {
    await super_admin_login(request, BASE_URL);
  });

  // 1.2
  test("Valid Email and invalid size of Password", async ({ request }) => {
    const Data = fixtureData.jsonData[1];

    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(Array.isArray(body.message)).toBe(true);
    expect(body.message[0]).toBe(
      "password must be longer than or equal to 6 characters"
    );
    expect(body).toHaveProperty("error", "Bad Request");
    expect(body).toHaveProperty("statusCode", 400);
  });

  // 1.3
  test("Sign in using invalid credentials", async ({ request }) => {
    const Data = fixtureData.jsonData[2];

    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const responseBody = await response.json();
    console.log('Response body:', responseBody);
    expect(response.status()).toBe(401);
    expect(responseBody.message).toBe(
      "Incorrect email or password"
    );
    expect(responseBody).toHaveProperty("error", "Unauthorized");
    expect(responseBody).toHaveProperty("statusCode", 401);
  });

  // 1.4
  test("Invalid email and valid password", async ({ request }) => {
    const Data = fixtureData.jsonData[3];
    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const responseBody = await response.json();
    console.log('Response body:', responseBody);
    expect(response.status()).toBe(400);
    expect(Array.isArray(responseBody.message)).toBe(true);
    expect(responseBody.message[0]).toBe(
      "email must be an email"
    );
    expect(responseBody).toHaveProperty("error", "Bad Request");
    expect(responseBody).toHaveProperty("statusCode", 400);
  });

  // 1.5
  test("Valid email end incorrect password", async ({ request }) => {
    const Data = fixtureData.jsonData[4];
    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(401);
    expect(responseBody.message).toBe(
      "Incorrect email or password"
    );
    expect(responseBody).toHaveProperty("error", "Unauthorized");
    expect(responseBody).toHaveProperty("statusCode", 401);
  });
});