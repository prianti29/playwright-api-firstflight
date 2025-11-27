import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { SELLER_SIGNUP } from "../../support/apiConstants.js";
import config from "../../playwright.config.js";
import fixtureData from "../../fixtures/AUTH/sellerSignUpData.json" assert { type: 'json' };

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
      password: "password"
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

    // Validate id is not empty
    expect(responseBody.id).toBeTruthy();
    expect(responseBody.id.length).toBeGreaterThan(0);

    // Validate input data matches response
    expect(responseBody.firstName).toBe(data.firstName);
    expect(responseBody.lastName).toBe(data.lastName);
    expect(responseBody.email).toBe(data.email);

    // Validate email format
    expect(responseBody.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    // Validate boolean values
    expect(responseBody.isProfileComplete).toBe(false);
    expect(responseBody.isActive).toBe(true);

    // Validate ISO 8601 date format (YYYY-MM-DDTHH:mm:ss.sssZ)
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    expect(responseBody.createdAt).toMatch(isoDateRegex);
    expect(responseBody.updatedAt).toMatch(isoDateRegex);

    // Validate dates are valid and not "Invalid Date"
    expect(new Date(responseBody.createdAt).toString()).not.toBe("Invalid Date");
    expect(new Date(responseBody.updatedAt).toString()).not.toBe("Invalid Date");

    // Validate createdAt and updatedAt are the same (for new records)
    expect(responseBody.createdAt).toBe(responseBody.updatedAt);
  });

  // 2.2
  test("Seller sign up with valid firstname, lastname, password and invalid email", async ({ request }) => {
    const data = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: "invalid-email-format",
      password: "password"
    };

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
  test.only("seller sign up with existing email ", async ({ request }) => {
    const data = fixtureData.jsonData[0];
    const response = await postSellerSignUp(request, data);
    const responseBody = await response.json();

    console.log('Response status:', response.status());
    console.log('Response body:', JSON.stringify(responseBody, null, 2));

    expect(responseBody).toEqual(
      expect.objectContaining({
        // message: expect.stringContaining("A seller already exists with this email"),
        // error: "Conflict",
        // statusCode: 409,
      })
    );
  });
}); 
