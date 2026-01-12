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


test.describe("Update Current Admin Password Tests", () => {
     test.beforeEach(async ({ request }) => {
          await current_admin_login(request, BASE_URL);
     })

     // 3.1
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

          const response1 = await request.patch(`${BASE_URL}${UPDATE_CURRENT_ADMIN_PASSWORD}`, {
               headers: authHeaders(),
               data: payload1,
          });
          expect(response1.status()).toBe(200);
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

          const response2 = await request.patch(`${BASE_URL}${UPDATE_CURRENT_ADMIN_PASSWORD}`, {
               headers: authHeaders(newToken),
               data: payload2,
          });

          const responseBody2 = await response2.text(); // Get text first to avoid JSON errors if empty
          console.log(`Reset password response status: ${response2.status()}`);
          if (responseBody2) {
               console.log(`Reset password response body: ${responseBody2}`);
          }

          expect(response2.status()).toBe(200);

          // Verify we can login again with the original password
          await current_admin_login(request, BASE_URL);

     });


});
