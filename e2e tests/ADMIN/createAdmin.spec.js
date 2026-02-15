import { test, expect } from "@playwright/test";
import { ADMINS } from "../../support/apiConstants.js";
import { super_admin_login, create_admin } from "../../support/command.js";
import fixtureData from "../../fixtures/ADMIN/createAdminData.js";
import { faker } from "@faker-js/faker";

import { BASE_URL } from "../../playwright.config.js";

const authHeaders = () => ({
     "Content-Type": "application/json",
     Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
});

const createAdminRequest = (request, data) =>
     request.post(`${BASE_URL}${ADMINS}`, {
          data,
          headers: authHeaders(),
     });

const createRequest = async (request, data, expectedStatus) => {
     const response = await createAdminRequest(request, data);
     expect(response.status()).toBe(expectedStatus);
     return response.json();
};

test.describe.serial("Create Admin Tests", () => {
     test.beforeEach(async ({ request }) => {
          await super_admin_login(request, BASE_URL);
     });

     // 2.1
     test("Create Admin with valid credential", async ({ request }) => {
          await create_admin(request, BASE_URL);
     });

     // 2.2
     test("Missing firstname field", async ({ request }) => {
          const { firstName, ...data } = fixtureData.jsonData[0];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "firstName must be a string",
                         "firstName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.3
     test("Missing lastname field", async ({ request }) => {
          const { lastName, ...data } = fixtureData.jsonData[0];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "lastName must be a string",
                         "lastName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.4
     test("Missing email field", async ({ request }) => {
          const { email, ...data } = fixtureData.jsonData[0];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "email must be an email",
                         "email must be a string",
                         "email should not be empty",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(3);
     });

     // 2.5
     test("Missing permission field", async ({ request }) => {
          const { permissions, ...data } = fixtureData.jsonData[0];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write",
                         "All permissions's elements must be unique",
                         "permissions should not be empty",
                         "permissions must be an array"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(4);
     });

     // 2.6
     test("Missing password field", async ({ request }) => {
          const { password, ...data } = fixtureData.jsonData[0];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(3);
     });

     // 2.7
     test("Empty field of firstname and lastname", async ({ request }) => {
          const data = fixtureData.jsonData[1];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "firstName should not be empty",
                         "lastName should not be empty",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.8
     test("Create with 'all' permission", async ({ request }) => {
          const data = fixtureData.jsonData[2];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Invalid permission requested: all",
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     // 2.9
     test("Invalid permission field", async ({ request }) => {
          const data = fixtureData.jsonData[3];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(1);
     });

     // 2.10
     test("Null firstName field", async ({ request }) => {
          const data = { ...fixtureData.jsonData[0], firstName: null };
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "firstName must be a string",
                         "firstName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.11
     test("Null lastName field", async ({ request }) => {
          const data = { ...fixtureData.jsonData[0], lastName: null };
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "lastName must be a string",
                         "lastName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.12
     test("Null email field", async ({ request }) => {
          const data = { ...fixtureData.jsonData[0], email: null };
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "email must be an email",
                         "email must be a string",
                         "email should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(3);
     });

     // 2.13
     test("Null designation field", async ({ request }) => {
          const data = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
               email: faker.internet.email(),
               password: faker.internet.password({ length: 8 }),
               designation: null,
               permissions: ["admins_read", "admins_write"]
          };
          const responseBody = await createRequest(request, data, 200);
     });

     // 2.14
     test("Null password field", async ({ request }) => {
          const data = { ...fixtureData.jsonData[0], password: null };
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(3);
     });

     // 2.15
     test("Null permissions array", async ({ request }) => {
          const data = { ...fixtureData.jsonData[0], permissions: [null] };
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(1);
     });

     // 2.16
     test("Null isActive", async ({ request }) => {
          const data = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
               email: faker.internet.email(),
               password: faker.internet.password({ length: 8 }),
               designation: faker.person.jobTitle(),
               permissions: ["admins_read", "admins_write"]
               , isActive: null
          };
          const responseBody = await createRequest(request, data, 200);
     });

     // 2.17
     test("Create with empty firstName", async ({ request }) => {
          const data = fixtureData.jsonData[4];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "firstName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(1);
     });

     // 2.18
     test("Create with empty lastName", async ({ request }) => {
          const data = fixtureData.jsonData[5];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "lastName should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(1);
     });

     // 2.19
     test("Create with empty email", async ({ request }) => {
          const data = fixtureData.jsonData[6];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "email must be an email",
                         "email should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.20
     test("Create with empty designation", async ({ request }) => {
          const data = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
               email: faker.internet.email(),
               password: faker.internet.password({ length: 8 }),
               designation: "",
               permissions: ["admins_read", "admins_write"]
          };
          const responseBody = await createRequest(request, data, 200);
     });

     // 2.21
     test("Create with empty password", async ({ request }) => {
          const data = fixtureData.jsonData[7];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be longer than or equal to 6 characters",
                         "password should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.22
     test("Create with empty permissions", async ({ request }) => {
          const data = fixtureData.jsonData[8];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(1);
     });

     // 2.23
     test("Invalid data type of password", async ({ request }) => {
          const data = fixtureData.jsonData[9];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be longer than or equal to 6 and shorter than or equal to 100 characters",
                         "password must be a string"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(2);
     });

     // 2.24
     test("Create with short pass", async ({ request }) => {
          const data = fixtureData.jsonData[10];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be longer than or equal to 6 characters"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(1);
     });

     // 2.25
     test("Create with invalid type of email", async ({ request }) => {
          const data = fixtureData.jsonData[11];
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "email must be an email"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
          expect(responseBody.message).toHaveLength(1);
     });

     // 2.26
     test("Duplicate Email", async ({ request }) => {
          const data = fixtureData.jsonData[12];
          const responseBody = await createRequest(request, data, 409);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "An admin already exists with this email",
                    error: "Conflict",
                    statusCode: 409,
               })
          );
     });
     // 2.27
     test("Create with extra field", async ({ request }) => {
          const data = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
               email: faker.internet.email(),
               password: faker.internet.password({ length: 8 }),
               designation: faker.person.jobTitle(),
               permissions: ["admins_read", "admins_write"],
               extraField: "extraField"
          };
          const responseBody = await createRequest(request, data, 200);
     });

     // 2.28
     test("Missing request field", async ({ request }) => {
          const data = {};
          const responseBody = await createRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "firstName must be a string",
                         "firstName should not be empty",
                         "lastName must be a string",
                         "lastName should not be empty",
                         "email must be an email",
                         "email must be a string",
                         "email should not be empty",
                         "password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty",
                         "each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write",
                         "All permissions's elements must be unique",
                         "permissions should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     // 2.29
     test("Create with admin access token who is not allowed", async ({ request }) => {
          // Save invalid access token to environment
          const invalidToken = "invalid_token_12345";
          process.env.SUPER_ADMIN_ACCESS_TOKEN = invalidToken;

          const data = fixtureData.jsonData[0];
          const responseBody = await createRequest(request, data, 401);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Invalid access token",
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });
});

