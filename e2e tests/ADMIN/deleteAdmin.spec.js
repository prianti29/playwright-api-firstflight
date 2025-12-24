import { test, expect } from "@playwright/test";
import { ADMINS, ADMIN_LOGIN } from "../../support/apiConstants.js";
import { super_admin_login, create_admin, create_admin_without_permissions, delete_admin } from "../../support/command.js";
import config from "../../playwright.config.js";

const BASE_URL = config.use?.BASE_URL;

const authHeaders = () => ({
     "Content-Type": "application/json",
     Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
});

const deleteAdminRequest = (request, adminId) =>
     request.delete(`${BASE_URL}${ADMINS}/${adminId}`, {
          headers: authHeaders(),
     });

const deleteRequest = async (request, adminId, expectedStatus) => {
     const response = await deleteAdminRequest(request, adminId);
     expect(response.status()).toBe(expectedStatus);
     if (response.status() !== 204) {
          return response.json();
     }
     return null;
};

test.describe("Delete Admin Tests", () => {
     test.beforeEach(async ({ request }) => {
          await super_admin_login(request, BASE_URL);

     });

     // 3.1
     test("Delete Admin with valid ID", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;
          // Delete the admin using the command function
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.2
     test("Delete Admin with invalid ID format", async ({ request }) => {
          const invalidId = "invalid-id-format";
          const responseBody = await deleteRequest(request, invalidId, 404);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Admin not found"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );
     });

     // 3.3
     test("Delete Admin with non-existent ID", async ({ request }) => {
          const nonExistentId = "nonexistent123456789012345";
          const responseBody = await deleteRequest(request, nonExistentId, 404);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Admin not found"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );
     });

     // 3.4
     test("Delete Admin without authentication token", async ({ request }) => {
          // Create an admin first
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          // Remove token
          const originalToken = process.env.SUPER_ADMIN_ACCESS_TOKEN;
          delete process.env.SUPER_ADMIN_ACCESS_TOKEN;

          const response = await request.delete(`${BASE_URL}${ADMINS}/${adminId}`, {
               headers: {
                    "Content-Type": "application/json",
               },
          });

          // Restore token
          process.env.SUPER_ADMIN_ACCESS_TOKEN = originalToken;

          expect(response.status()).toBe(401);
          const responseBody = await response.json();
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Invalid access token"),
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     // 3.5
     test("Delete Admin with invalid access token", async ({ request }) => {
          // Create an admin first
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          // Set invalid token
          const originalToken = process.env.SUPER_ADMIN_ACCESS_TOKEN;
          process.env.SUPER_ADMIN_ACCESS_TOKEN = "invalid_token_12345";

          const response = await deleteAdminRequest(request, adminId);

          // Restore token
          process.env.SUPER_ADMIN_ACCESS_TOKEN = originalToken;

          expect(response.status()).toBe(401);
          const responseBody = await response.json();
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Invalid access token"),
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     // 3.6
     test("Delete Admin with admin access token who is not allowed", async ({ request }) => {
          const adminWithoutPermissions = await create_admin_without_permissions(request, BASE_URL);

          // Get the admin ID and access token from the created admin
          const adminId = adminWithoutPermissions.id;
          const adminAccessToken = adminWithoutPermissions.accessToken;

          // Save the admin's access token (without permissions) to environment
          const originalToken = process.env.SUPER_ADMIN_ACCESS_TOKEN;
          process.env.SUPER_ADMIN_ACCESS_TOKEN = adminAccessToken;

          // Try to delete admin using the admin without permissions token (should fail)
          const response = await deleteAdminRequest(request, adminId);

          // Restore original token
          process.env.SUPER_ADMIN_ACCESS_TOKEN = originalToken;

          expect(response.status()).toBe(403);
          const responseBody = await response.json();
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Forbidden resource",
                    error: "Forbidden",
                    statusCode: 403,
               })
          );
     });

     // 3.7
     test("Delete Admin with empty ID", async ({ request }) => {
          const emptyId = "";
          const responseBody = await deleteRequest(request, emptyId, 404);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Cannot DELETE"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );
     });

     // 3.8
     test("Delete Admin with null ID", async ({ request }) => {

          const nullId = "null";
          const responseBody = await deleteRequest(request, nullId, 404);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Admin not found"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );
     });

     // 3.9
     test("Delete Admin that is already deleted", async ({ request }) => {

          const adminId = "zbhbgbz01ff4q4u8lw0d59k3";
          // Try to delete again
          const responseBody = await deleteRequest(request, adminId, 404);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Admin not found"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );
     });
});

