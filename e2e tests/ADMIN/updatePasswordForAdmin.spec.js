import { test, expect } from "@playwright/test";
import { ADMINS, UPDATE_CURRENT_ADMIN_PASSWORD, CURRENT_ADMIN } from "../../support/apiConstants.js";
import { current_admin_login } from "../../support/command.js";
import config from "../../playwright.config.js";
import { faker } from "@faker-js/faker";
import adminLoginData from "../../fixtures/AUTH/adminLoginData.js";

const BASE_URL = config.use?.BASE_URL;

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
     test.beforeEach(async ({ request }) => {
          await current_admin_login(request, BASE_URL);
     })

     // 4.1
     test("update password of current admin with valid old password and new password", async ({ request }) => {

          // Update the current admin password with new password
          const currentAdminData = adminLoginData.jsonData[8];
          const initialPassword = currentAdminData.password; // Should be "12345678"
          const randomPassword = faker.internet.password();

          // Step 1: Update from initial password to random password
          const payload1 = {
               oldPassword: initialPassword,
               newPassword: randomPassword,
          };
          const response1 = await updatePasswordRequest(request, payload1, 200);
          console.log(`Password updated to: ${randomPassword}`);

          // Wait a moment for the password change to propagate (matching logic from provided snippet)
          await new Promise(resolve => setTimeout(resolve, 500));

          // Login with new password to get a valid token for reset
          console.log("Verifying login with new password...");
          const newToken = await current_admin_login(request, BASE_URL, {
               email: currentAdminData.email,
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

     //4.6
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
});
