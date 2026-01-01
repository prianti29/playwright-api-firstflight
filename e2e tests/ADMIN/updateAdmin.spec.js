import { test, expect } from "@playwright/test";
import { ADMINS, ADMIN_LOGIN } from "../../support/apiConstants.js";
import { super_admin_login, create_admin, create_admin_without_permissions, delete_admin } from "../../support/command.js";
import config from "../../playwright.config.js";
import { faker } from "@faker-js/faker";

const BASE_URL = config.use?.BASE_URL;

const authHeaders = (token = null) => ({
     "Content-Type": "application/json",
     Authorization: `Bearer ${token || process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
});


const updateAdminRequest = (request, adminId, data, token = null) =>
     request.patch(`${BASE_URL}${ADMINS}/${adminId}`, {
          data,
          headers: authHeaders(token),
     });

const updateRequest = async (request, adminId, data, expectedStatus, token = null) => {
     const response = await updateAdminRequest(request, adminId, data, token);
     expect(response.status()).toBe(expectedStatus);
     if (response.status() !== 204) {
          const responseText = await response.text();
          if (responseText && responseText.trim() !== '') {
               return JSON.parse(responseText);
          }
     }
     return null;
};

test.describe("Update Admin Tests", () => {
     test.beforeEach(async ({ request }) => {
          await super_admin_login(request, BASE_URL);
     });

     // 3.1
     test("Update Admin with valid data", async ({ request }) => {
          // Create an admin to update
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          // Update the admin with new data using super admin token
          const updateData = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
               designation: faker.person.jobTitle(),
               permissions: ["admins_read", "sellers_read"]
          };

          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    id: expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    designation: expect.any(String),
                    email: expect.any(String),
                    permissions: expect.any(Array),
                    isActive: expect.any(Boolean),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
               })
          );
          expect(responseBody.firstName).toBe(updateData.firstName);
          expect(responseBody.lastName).toBe(updateData.lastName);
          expect(responseBody.designation).toBe(updateData.designation);

          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.2
     test("update current admin firstname and lastname", async ({ request }) => {
          // Create an admin first
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          // Update the admin with new data
          const updateData = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName()
          };

          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    id: expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    designation: expect.any(String),
                    email: expect.any(String),
                    permissions: expect.any(Array),
                    isActive: expect.any(Boolean),
                    updatedAt: expect.any(String)
               })
          );
          expect(responseBody.firstName).toBe(updateData.firstName);
          expect(responseBody.lastName).toBe(updateData.lastName);
          await delete_admin(request, adminId, BASE_URL);

     });

     // 3.3
     test("update current admin email", async ({ request }) => {
          // Create an admin first
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          // Update the admin with new data
          const updateData = {
               email: faker.internet.email(),
          };

          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    id: expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    designation: expect.any(String),
                    email: expect.any(String),
                    permissions: expect.any(Array),
                    isActive: expect.any(Boolean),
                    updatedAt: expect.any(String)
               })
          );
          expect(responseBody.email).toBe(updateData.email);
          await delete_admin(request, adminId, BASE_URL);

     });

     // 3.4
     test("update current admin permission", async ({ request }) => {
          // Create an admin first
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          // Update the admin with new data
          const updateData = {
               permissions: ["admins_read", "sellers_read"],
          };

          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    id: expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    designation: expect.any(String),
                    email: expect.any(String),
                    permissions: expect.any(Array),
                    isActive: expect.any(Boolean),
                    updatedAt: expect.any(String)
               })
          );
          expect(responseBody.permissions).toEqual(updateData.permissions);
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.5
     test("update current admin isActive", async ({ request }) => {
          // Create an admin first
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          // Update the admin with new data
          const updateData = {
               isActive: false,
          };

          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    id: expect.any(String),
                    firstName: expect.any(String),
                    lastName: expect.any(String),
                    designation: expect.any(String),
                    email: expect.any(String),
                    permissions: expect.any(Array),
                    isActive: expect.any(Boolean),
                    updatedAt: expect.any(String)
               })
          );
          expect(responseBody.isActive).toEqual(updateData.isActive);

          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.6
     test("Update Admin with invalid ID", async ({ request }) => {
          const invalidId = "invalid-id-format";
          const updateData = {
               firstName: faker.person.firstName(),
          };
          const responseBody = await updateRequest(request, invalidId, updateData, 404);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Admin not found"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );
     });

     // 3.7
     test("Update Admin with non-existent ID", async ({ request }) => {
          const nonExistentId = "nonexistent123456789012345";
          const updateData = {
               firstName: faker.person.firstName(),
          };
          const responseBody = await updateRequest(request, nonExistentId, updateData, 404);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Admin not found"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );

     });

     // 3.8
     test("Update Admin without authentication token", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const originalToken = process.env.SUPER_ADMIN_ACCESS_TOKEN;
          delete process.env.SUPER_ADMIN_ACCESS_TOKEN;

          const response = await request.patch(`${BASE_URL}${ADMINS}/${adminId}`, {
               data: { firstName: faker.person.firstName() },
               headers: { "Content-Type": "application/json" },
          });

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
          await delete_admin(request, adminId, BASE_URL);

     });

     // 3.9
     test("Update Admin with invalid access token", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const originalToken = process.env.SUPER_ADMIN_ACCESS_TOKEN;
          process.env.SUPER_ADMIN_ACCESS_TOKEN = "invalid_token_12345";

          const response = await updateAdminRequest(request, adminId, { firstName: faker.person.firstName() });

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
          await delete_admin(request, adminId, BASE_URL);

     });

     // 3.10
     test("Update Admin with admin access token who is not allowed", async ({ request }) => {
          // Create an admin without permissions
          const adminWithoutPermissions = await create_admin_without_permissions(request, BASE_URL);
          const adminAccessToken = adminWithoutPermissions.accessToken;

          // Create another admin to update
          const adminToUpdate = await create_admin(request, BASE_URL);
          const adminId = adminToUpdate.id;

          const originalToken = process.env.SUPER_ADMIN_ACCESS_TOKEN;
          process.env.SUPER_ADMIN_ACCESS_TOKEN = adminAccessToken;

          const response = await updateAdminRequest(request, adminId, {
               firstName: faker.person.firstName(),
          });

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
          await delete_admin(request, adminId, BASE_URL);

     });

     // 3.11
     test("Update Admin with empty firstName", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { firstName: "" };
          const responseBody = await updateRequest(request, adminId, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "firstName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.12
     test("Update Admin with empty lastName", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { lastName: "" };
          const responseBody = await updateRequest(request, adminId, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "lastName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.13
     test("Update Admin with null firstName", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { firstName: null };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();

          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.14
     test("Update Admin with null lastName", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { lastName: null };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();

          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.15
     test("Update Admin with invalid permissions", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { permissions: ["invalid_permission"] };
          const responseBody = await updateRequest(request, adminId, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.16
     test("Update Admin with empty permissions array", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { permissions: [] };
          const responseBody = await updateRequest(request, adminId, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "permissions should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.17
     test("Update Admin with empty request body", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const responseBody = await updateRequest(request, adminId, {}, 200);
          // Empty body should be allowed for PATCH (partial update)
          expect(responseBody).toBeDefined();

          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.18
     test("Update Admin with 'all' permission", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { permissions: ["all"] };
          const responseBody = await updateRequest(request, adminId, updateData, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Invalid permission requested: all",
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.19
     test("Update Admin with duplicate permissions", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { permissions: ["admins_read", "admins_read"] };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();
          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.20
     test("Update Admin with empty ID", async ({ request }) => {
          const emptyId = "";
          const updateData = { firstName: faker.person.firstName() };
          const response = await request.patch(`${BASE_URL}${ADMINS}/${emptyId}`, {
               data: updateData,
               headers: authHeaders(),
          });
          expect(response.status()).toBe(404);
          const responseBody = await response.json();
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Cannot PATCH /v1/admins/"),
                    error: "Not Found",
                    statusCode: 404,
               })
          );
     });

     // 3.21
     test("Update with Extra Undefined Field", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { permissions: ["admins_read", "admins_read"], extra: "undefined" };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();
          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.22
     test("Duplicate profile photo id", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { permissions: ["admins_read", "admins_read"], extra: "undefined" };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();
          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.22
     test("Duplicate Email id", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { email: faker.internet.email() };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();
          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // 3.23
     test("Update with null email", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { email: null };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();
          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });


     // 3.24
     test("Update with null permission", async ({ request }) => {
          const createdAdmin = await create_admin(request, BASE_URL);
          const adminId = createdAdmin.id;

          const updateData = { permissions: null };
          const responseBody = await updateRequest(request, adminId, updateData, 200);
          expect(responseBody).toBeDefined();
          // Cleanup: Delete the created admin
          await delete_admin(request, adminId, BASE_URL);
     });

     // // 3.25
     // test("Update with empty permission", async ({ request }) => {
     //      const createdAdmin = await create_admin(request, BASE_URL);
     //      const adminId = createdAdmin.id;

     //      const updateData = { permissions: [] };
     //      const responseBody = await updateRequest(request, adminId, updateData, 200);
     //      expect(responseBody).toBeDefined();
     //      // Cleanup: Delete the created admin
     //      await delete_admin(request, adminId, BASE_URL);
     // });
});

