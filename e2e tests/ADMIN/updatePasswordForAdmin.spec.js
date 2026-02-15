import { test, expect } from "@playwright/test";
import { ADMINS, UPDATE_CURRENT_ADMIN_PASSWORD, CURRENT_ADMIN } from "../../support/apiConstants.js";
import { current_admin_login, default_seller_signin, super_admin_login, create_admin, delete_admin } from "../../support/command.js";
import { faker } from "@faker-js/faker";

const BASE_URL = process.env.BASE_URL;

const authHeaders = (token = null) => ({
     "Content-Type": "application/json",
     Authorization: `Bearer ${token || process.env.CURRENT_ADMIN_ACCESS_TOKEN}`,
});



const sendUpdatePasswordRequest = (request, data, token = null) =>
     request.patch(`${BASE_URL}${UPDATE_CURRENT_ADMIN_PASSWORD}`, {
          data,
          headers: authHeaders(token),
     });

const updatePasswordRequest = async (request, data, expectedStatus, token = null) => {
     const response = await sendUpdatePasswordRequest(request, data, token);
     expect(response.status()).toBe(expectedStatus);
     if (response.status() !== 204) {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== '') {
               return JSON.parse(responseText);
          }
     }
     return null;
};


test.describe.serial("Update Current Admin Password Tests", () => {
     let adminEmail;
     let adminPassword;
     let adminId;

     // Setup once for all tests: Create a dedicated admin to ensure test isolation
     test.beforeAll(async ({ playwright }) => {
          const apiContext = await playwright.request.newContext({
               baseURL: BASE_URL
          });
          await super_admin_login(apiContext, BASE_URL);
          adminEmail = faker.internet.email();
          adminPassword = "12345678";
          const newAdmin = await create_admin(apiContext, BASE_URL, {
               email: adminEmail,
               password: adminPassword,
               firstName: "Test",
               lastName: "Admin",
               designation: "Tester",
               permissions: ["admins_read", "admins_write"]
          });
          adminId = newAdmin.id;
          await apiContext.dispose();
     });

     // Cleanup once after all tests: Delete the dedicated admin
     test.afterAll(async ({ playwright }) => {
          const apiContext = await playwright.request.newContext({
               baseURL: BASE_URL
          });
          if (adminId) {
               await delete_admin(apiContext, adminId, BASE_URL);
          }
          await apiContext.dispose();
     });

     // Runs before each test: Authenticate as the dedicated admin
     test.beforeEach(async ({ request }) => {
          await current_admin_login(request, BASE_URL, {
               email: adminEmail,
               password: adminPassword
          });
     })

     //4.2
     test("update password of current admin with invalid old password and new password", async ({ request }) => {
          // Update the admin with new data
          const updateData = {
               oldPassword: "invalidPassword",
               newPassword: faker.internet.password()
          };

          const responseBody = await updatePasswordRequest(request, updateData, 401);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.any(String),
               })
          );
          expect(responseBody.message).toBe("Incorrect old password");
          expect(responseBody.error).toBe("Unauthorized");

     });

     //4.3     
     test("update password of current admin without old password and valid new password", async ({ request }) => {

          // Update the admin with new data
          const updateData = {
               newPassword: faker.internet.password()
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "oldPassword must be longer than or equal to 6 characters",
                         "oldPassword must be a string",
                         "oldPassword should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.4
     test("update password of current admin without new password and valid old password", async ({ request }) => {

          // Update the admin with new data
          const updateData = {
               oldPassword: "12345678"
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "newPassword must be longer than or equal to 6 characters",
                         "newPassword must be a string",
                         "newPassword should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.5
     test("Short length of newPassword", async ({ request }) => {

          // Update the admin with new data
          const updateData = {
               oldPassword: "12345678",
               newPassword: "123"
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "newPassword must be longer than or equal to 6 characters"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.6
     test("Short length of oldPassword", async ({ request }) => {

          // Update the admin with new data
          const updateData = {
               oldPassword: "123",
               newPassword: "12345678"
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "oldPassword must be longer than or equal to 6 characters"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.7
     test("Null value in oldPassword", async ({ request }) => {

          // Update the admin with new data
          const updateData = {
               oldPassword: null,
               newPassword: "12345678"
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "oldPassword must be longer than or equal to 6 characters",
                         "oldPassword must be a string",
                         "oldPassword should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.8
     test("Null value in newPassword", async ({ request }) => {

          // Update the admin with new data
          const updateData = {
               oldPassword: "12345678",
               newPassword: null
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "newPassword must be longer than or equal to 6 characters",
                         "newPassword must be a string",
                         "newPassword should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.9
     test("Empty value of oldPassword", async ({ request }) => {

          // Update the admin with new data
          const updateData = {
               oldPassword: "",
               newPassword: "12345678"
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "oldPassword must be longer than or equal to 6 characters",
                         "oldPassword should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.10
     test("Empty value of newPassword value", async ({ request }) => {
          // Update the admin with new data
          const updateData = {
               oldPassword: "12345678",
               newPassword: ""
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "newPassword must be longer than or equal to 6 characters",
                         "newPassword should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.11
     test("Update with same oldPassword and newPassword", async ({ request }) => {
          // Update the admin with new data
          const updateData = {
               oldPassword: "12345678",
               newPassword: "12345678"
          };

          await updatePasswordRequest(request, updateData, 200);
     });


     //4.12
     test("Number value of oldPassword", async ({ request }) => {
          await current_admin_login(request, BASE_URL);
          // Update the admin with new data
          const updateData = {
               oldPassword: 12345678,
               newPassword: "12345678"
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "oldPassword must be longer than or equal to 6 and shorter than or equal to 100 characters",
                         "oldPassword must be a string"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.13
     test("Number value of newPassword", async ({ request }) => {
          // Update the admin with new data
          const updateData = {
               oldPassword: "12345678",
               newPassword: 12345678
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "newPassword must be longer than or equal to 6 and shorter than or equal to 100 characters",
                         "newPassword must be a string"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.14
     test("Update with long password", async ({ request }) => {
          // Update the admin with new data
          const updateData = {
               oldPassword: "12345678",
               newPassword: "a".repeat(101)
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "newPassword must be shorter than or equal to 100 characters"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.15
     test("Boolean value in oldPassword", async ({ request }) => {
          const updateData = {
               oldPassword: true,
               newPassword: "12345678"
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "oldPassword must be longer than or equal to 6 and shorter than or equal to 100 characters",
                         "oldPassword must be a string"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.16
     test("Boolean value in newPassword", async ({ request }) => {
          const updateData = {
               oldPassword: "12345678",
               newPassword: true
          };

          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "newPassword must be longer than or equal to 6 and shorter than or equal to 100 characters",
                         "newPassword must be a string"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });


     //4.18
     test("Empty request", async ({ request }) => {
          await current_admin_login(request, BASE_URL);
          const updateData = {
          };
          const responseBody = await updatePasswordRequest(request, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "oldPassword must be longer than or equal to 6 characters",
                         "oldPassword must be a string",
                         "oldPassword should not be empty",
                         "newPassword must be longer than or equal to 6 characters",
                         "newPassword must be a string",
                         "newPassword should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //4.19
     test("Update with unauthorize token", async ({ request }) => {
          const updateData = {
               "oldPassword": "12345678",
               "newPassword": "12345678"
          };

          const invalidToken = process.env.INVALID_ACCESS_TOKEN;
          const responseBody = await updatePasswordRequest(request, updateData, 401, invalidToken);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Invalid access token",
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     //4.20
     test("Update with seller access", async ({ request }) => {

          const updateData = {
               "oldPassword": "12345678",
               "newPassword": "12345678"
          };

          const sellerAccessToken = await default_seller_signin(request, BASE_URL);
          const responseBody = await updatePasswordRequest(request, updateData, 403, sellerAccessToken);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Forbidden resource",
                    error: "Forbidden",
                    statusCode: 403,
               })
          );
     });

     // 4.1 Moved to end to prevent side effects
     test("update password of current admin with valid old password and new password", async ({ request }) => {

          // Update the current admin password with new password
          const initialPassword = adminPassword; // "12345678"
          const randomPassword = faker.internet.password();

          // Step 1: Update from initial password to random password
          const payload1 = {
               oldPassword: initialPassword,
               newPassword: randomPassword,
          };
          const response1 = await updatePasswordRequest(request, payload1, 200);
          console.log(`Password updated to: ${randomPassword}`);

          // Wait a moment for the password change to propagate
          await new Promise(resolve => setTimeout(resolve, 500));

          // Login with new password to get a valid token for reset
          console.log("Verifying login with new password...");
          const newToken = await current_admin_login(request, BASE_URL, {
               email: adminEmail,
               password: randomPassword
          });
          expect(newToken).toBeTruthy();
          console.log(`New Access Token obtained: ${newToken.substring(0, 10)}...`);

          // Step 2: Reset password back to default "12345678" using the new token
          const payload2 = {
               oldPassword: randomPassword,
               newPassword: initialPassword, // Resetting back to "12345678"
          };
          console.log("Request Payload 2:", payload2);

          const response2 = await updatePasswordRequest(request, payload2, 200, newToken);

          if (response2) {
               console.log(`Reset password response body: ${JSON.stringify(response2)}`);
          }
     });
});
