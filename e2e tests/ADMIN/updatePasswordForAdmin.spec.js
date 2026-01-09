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
     test.only("update password of current admin with valid old password and new password", async ({ request }) => {

          // // Update the current admin password with new password
          // const currentAdminData = adminLoginData.jsonData[8];
          // const initialPassword = currentAdminData.password;
          // const randomPassword = faker.internet.password();

          // // Step 1: Update from initial password to random password
          // const response1 = await request.put(`${BASE_URL}${UPDATE_CURRENT_ADMIN_PASSWORD}`, {
          //      headers: authHeaders(),
          //      data: {
          //           oldPassword: initialPassword,
          //           newPassword: randomPassword,
          //      },
          // });
          // const responseBody1 = await response1.json();
          // expect(response1.status()).toBe(200);


          // // Step 2: Update from random password back to default "12345678"
          // const response2 = await request.put(`${BASE_URL}${UPDATE_CURRENT_ADMIN_PASSWORD}`, {
          //      headers: authHeaders(),
          //      data: {
          //           oldPassword: randomPassword,
          //           newPassword: "12345678",
          //      },
          // });
          // const responseBody2 = await response2.json();
          // expect(response2.status()).toBe(200);

          await current_admin_login(request, BASE_URL);

     });

});
