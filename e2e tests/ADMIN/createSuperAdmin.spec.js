import { test, expect } from "@playwright/test";
import { SUPER_ADMIN_CREATE } from "../../support/apiConstants.js";
import config from "../../playwright.config.js";
import fixtureData from "../../fixtures/ADMIN/createSuperAdminData.js";

const BASE_URL = config.use?.BASE_URL;

const authHeaders = () => ({
     "Content-Type": "application/json"
});

const postSuperAdminCreate = (request, data) =>
     request.post(`${BASE_URL}${SUPER_ADMIN_CREATE}`, {
          data,
          headers: authHeaders(),
     });

const superAdminCreateRequest = async (request, data, expectedStatus) => {
     const response = await postSuperAdminCreate(request, data);
     expect(response.status()).toBe(expectedStatus);
     return response.json();
};

test.describe("Create Super Admin Test Suite", () => {
     // 1.1
     test("existing super admin signup", async ({ request }) => {
          const data = fixtureData.jsonData[0];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Super admin already exists",
                    error: "Bad Request",
                    statusCode: 400,
               })
          );

     });
});