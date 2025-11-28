import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { SELLER_SIGNUP } from "../../support/apiConstants.js";
import config from "../../playwright.config.js";
import fixtureData from "../../fixtures/AUTH/sellerSignUpData.js";

const BASE_URL = config.use?.BASE_URL;

const postSellerSignUp = async (request, data) => {
  const response = await request.post(`${BASE_URL}${SELLER_SIGNUP}`, {
    data,
    headers: { "Content-Type": "application/json" },
  });
  return response;
};

const signUpRequest = async (request, data, expectedStatus) => {
  const response = await postSellerSignUp(request, data);
  expect(response.status()).toBe(expectedStatus);
  return response.json();
};

test.describe("Seller Sign Up Tests", () => {
  // 2.1
  test("Seller sign up with valid firstname, lastname, email, password", async ({ request }) => {
    const data = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 })
    };

    const responseBody = await signUpRequest(request, data, 200);

    // Validate response body structure and all required fields
    expect(responseBody).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        firstName: expect.any(String),
        lastName: expect.any(String),
        email: expect.any(String),
        isProfileComplete: expect.any(Boolean),
        isActive: expect.any(Boolean),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    );

    // Validate data types
    expect(typeof responseBody.id).toBe("string");
    expect(typeof responseBody.firstName).toBe("string");
    expect(typeof responseBody.lastName).toBe("string");
    expect(typeof responseBody.email).toBe("string");
    expect(typeof responseBody.isProfileComplete).toBe("boolean");
    expect(typeof responseBody.isActive).toBe("boolean");
    expect(typeof responseBody.createdAt).toBe("string");
    expect(typeof responseBody.updatedAt).toBe("string");

    // Validate email format
    expect(responseBody.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    // Validate that email matches input
    expect(responseBody.email).toBe(data.email);
    expect(responseBody.firstName).toBe(data.firstName);
    expect(responseBody.lastName).toBe(data.lastName);

    // Validate boolean values
    expect(responseBody.isProfileComplete).toBe(false);
    expect(responseBody.isActive).toBe(true);

    // Validate ISO 8601 date format
    expect(responseBody.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(responseBody.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

    // Validate that id is not empty
    expect(responseBody.id).toBeTruthy();
    expect(responseBody.id.length).toBeGreaterThan(0);

    // Validate that createdAt and updatedAt are valid dates
    expect(new Date(responseBody.createdAt).toString()).not.toBe("Invalid Date");
    expect(new Date(responseBody.updatedAt).toString()).not.toBe("Invalid Date");
  });


  // 2.2
  test("valid seller sign up firstname, lastname, password and invalid email", async ({ request }) => {
    const data = fixtureData.jsonData[0];
    const responseBody = await signUpRequest(request, data, 400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining(["email must be an email"]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });

  // 2.3
  test("seller sign up with existing email", async ({ request }) => {
    const data = fixtureData.jsonData[1];
    const responseBody = await signUpRequest(request, data, 409);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.stringContaining("A seller already exists with this email"),
        error: "Conflict",
        statusCode: 409,
      })
    );
  });

  // 2.4
  test("seller sign up with valid firstname, lastname, email and without password", async ({ request }) => {
    const { password, ...data } = fixtureData.jsonData[0];
    const responseBody = await signUpRequest(request, data, 400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining(["password must be longer than or equal to 6 characters"]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });

  // 2.5
  test("seller sign up with valid firstname without lastname, email and invalid size of password", async ({ request }) => {
    const { data } = fixtureData.jsonData[0];
    const responseBody = await signUpRequest(request, data, 400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "lastName must be a string",
          "lastName should not be empty",
          "password must be longer than or equal to 6 characters"
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });

  // 2.6
  test("seller sign up without firstname ,valid lastname, email and invalid size of password", async ({ request }) => {
    const { data } = fixtureData.jsonData[3];
    const responseBody = await signUpRequest(request, data, 400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "firstName must be a string",
          "firstName should not be empty",
          "password must be longer than or equal to 6 characters"
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });

  // 2.7
  test("seller sign up without firstname, password and valid lastname, email", async ({ request }) => {
    const { password, firstName, ...data } = fixtureData.jsonData[0];
    const responseBody = await signUpRequest(request, data, 400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "firstName must be a string",
          "firstName should not be empty",
          "password must be longer than or equal to 6 characters",
          "password must be a string",
          "password should not be empty"
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });

  // 2.8
  test("seller sign up without email and valid firstname, lastname , password", async ({ request }) => {
    const { email, ...data } = fixtureData.jsonData[0];
    const responseBody = await signUpRequest(request, data, 400);
    expect(responseBody).toEqual(
      expect.objectContaining({
        message: expect.arrayContaining([
          "email must be an email",
          "email must be a string",
          "email should not be empty"
        ]),
        error: "Bad Request",
        statusCode: 400,
      })
    );
  });
}); 
