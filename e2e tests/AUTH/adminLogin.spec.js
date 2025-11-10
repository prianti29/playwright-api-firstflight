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
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining(["password must be longer than or equal to 6 characters"]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
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
    expect(response.status()).toBe(401);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: "Incorrect email or password",
        error: "Unauthorized",
        statusCode: 401,
      })
    );
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
    expect(response.status()).toBe(400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining(["email must be an email"]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
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
    expect(responseBody).toMatchObject({
      message: "Incorrect email or password",
      error: "Unauthorized",
      statusCode: 401,
    });
  });

  // 1.6
  test("email missing field", async ({ request }) => {
    const Data = fixtureData.jsonData[5];
    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "email must be an email",
          "email must be a string",
          "email should not be empty",
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
    expect(responseBody.message).toHaveLength(3);
  });

  // 1.7
  test("Password missing field", async ({ request }) => {
    const Data = fixtureData.jsonData[6];
    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "password must be shorter than or equal to 100 characters",
          "password must be longer than or equal to 6 characters",
          "password must be a string",
          "password should not be empty"
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });

  // 1.8
  test("Empty request body", async ({ request }) => {
    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "email must be an email",
          "email must be a string",
          "email should not be empty",
          "password must be shorter than or equal to 100 characters",
          "password must be longer than or equal to 6 characters",
          "password must be a string",
          "password should not be empty"
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });

  // 1.9
  test("SQL Injection or Malicious Input", async ({ request }) => {
    const Data = fixtureData.jsonData[7];
    const response = await request.post(`${BASE_URL}${ADMIN_LOGIN}`, {
      data: Data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
      }
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "email must be an email",
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });
}); 
