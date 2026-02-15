import { test, expect } from "@playwright/test";
import { CURRENT_SELLER } from "../../support/apiConstants.js";
import { default_seller_signin, current_admin_login } from "../../support/command.js";

import { BASE_URL } from "../../playwright.config.js";

const authHeaders = (token = null) => {
     const bearerToken = token !== null ? token : process.env.SELLER_ACCESS_TOKEN;
     return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
     };
};

const getCurrentSellerRequest = (request, token = null) =>
     request.get(`${BASE_URL}${CURRENT_SELLER}`, {
          headers: authHeaders(token),
     });

const getRequest = async (request, expectedStatus, token = null) => {
     const response = await getCurrentSellerRequest(request, token);
     expect(response.status()).toBe(expectedStatus);
     return response.json();
};

test.describe.serial("Get Current Seller Test Suite", () => {

     //1.1
     test("Get current seller with seller access token", async ({ request }) => {
          await default_seller_signin(request, BASE_URL);
          const responseBody = await getRequest(request, 200);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    id: expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    email: expect.stringContaining("@"),
                    isProfileComplete: expect.any(Boolean),
                    isActive: expect.any(Boolean),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
               })
          );

          // Validate date
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
          expect(responseBody.createdAt).toMatch(isoDateRegex);
          expect(responseBody.updatedAt).toMatch(isoDateRegex);

          if (responseBody.profilePhoto) {
               expect(responseBody.profilePhoto).toEqual(
                    expect.objectContaining({
                         id: expect.any(String),
                         url: expect.stringContaining("https://"),
                    })
               );
          }

          expect(responseBody.stores.length).toBeGreaterThan(0);
     });

     //1.2
     test("Get current seller with invalid seller access token", async ({ request }) => {
          const invalidToken = "invalid_token_12345";
          const responseBody = await getRequest(request, 401, invalidToken);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Invalid access token"),
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     //1.3
     test("Forbidden to get current seller with admin access token", async ({ request }) => {
          const adminToken = await current_admin_login(request, BASE_URL);
          const responseBody = await getRequest(request, 403, adminToken);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Forbidden resource",
                    error: "Forbidden",
                    statusCode: 403,
               })
          );
     });
});
