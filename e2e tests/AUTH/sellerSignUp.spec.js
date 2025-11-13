import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { SELLER_SIGNUP } from "../../support/apiConstants.js";
import config from "../../playwright.config.js";

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
  test("Seller sign up with valid firstname, lastname, email, password", async ({ request }) => {
    const data = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 })
    };
    
    const responseBody = await postSellerSignUp(request, data, 200);
    expect(responseBody).toEqual(
      expect.objectContaining({
        "id": expect.any(String),
        "firstName": expect.any(String),
        "lastName": expect.any(String),
        "email": expect.any(String),
        "isProfileComplete": expect.any(Boolean),
        "isActive": expect.any(Boolean),
        "createdAt": expect.any(String),
        "updatedAt": expect.any(String)
      })
    );
    
      // Validate response body structure and types
      expect(responseBody).toHaveProperty("id");
      expect(responseBody).toHaveProperty("firstName");
      expect(responseBody).toHaveProperty("lastName");
      expect(responseBody).toHaveProperty("email");
      expect(responseBody).toHaveProperty("isProfileComplete");
      expect(responseBody).toHaveProperty("isActive");
      expect(responseBody).toHaveProperty("createdAt");
      expect(responseBody).toHaveProperty("updatedAt");
      
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
      expect(new Date(responseBody.updatedAt).toString()).not.toBe("Invalid Date")
  });
}); 
