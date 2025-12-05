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
     // 1.2
     test("existing super admin signup with another email and password", async ({ request }) => {
          const data = fixtureData.jsonData[1];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Super admin already exists",
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.3
     test("signup with without email ", async ({ request }) => {
          const data = fixtureData.jsonData[2];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["email must be an email",
                         "email must be a string",
                         "email should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.4
     test("signup without password", async ({ request }) => {
          const data = fixtureData.jsonData[3];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.5
     test("signup without firstName", async ({ request }) => {
          const data = fixtureData.jsonData[4];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["firstName must be a string",
                         "firstName should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.6
     test("signup without lastName", async ({ request }) => {
          const data = fixtureData.jsonData[5];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["lastName must be a string",
                         "lastName should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.7
     test("Signup without permissions", async ({ request }) => {
          const data = fixtureData.jsonData[6];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write",
                         "All permissions's elements must be unique",
                         "permissions should not be empty",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.8
     test("Null value on email", async ({ request }) => {
          const data = fixtureData.jsonData[7];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["email must be an email",
                         "email must be a string",
                         "email should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.9
     test("Null value on password", async ({ request }) => {
          const data = fixtureData.jsonData[8];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.10
     test("Null value on firstName", async ({ request }) => {
          const data = fixtureData.jsonData[9];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["firstName must be a string",
                         "firstName should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.11
     test("Null value on lastName", async ({ request }) => {
          const data = fixtureData.jsonData[10];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["lastName must be a string",
                         "lastName should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.12
     test("Null value on permission", async ({ request }) => {
          const data = fixtureData.jsonData[11];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write",
                         "All permissions's elements must be unique",
                         "permissions should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.13
     test("Without all field", async ({ request }) => {
          const data = fixtureData.jsonData[12];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write",
                         "All permissions's elements must be unique",
                         "permissions should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.14
     test("Empty string of firstName", async ({ request }) => {
          const data = fixtureData.jsonData[13];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["firstName should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.15
     test("Empty string of lastName", async ({ request }) => {
          const data = fixtureData.jsonData[14];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["lastName should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.16
     test("Empty string of email", async ({ request }) => {
          const data = fixtureData.jsonData[15];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["email must be an email",
                         "email should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });
     // 1.17
     test("Empty string of password", async ({ request }) => {
          const data = fixtureData.jsonData[16];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["password must be longer than or equal to 6 characters", "password should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     // 1.18
     test("Empty string of permissions", async ({ request }) => {
          const data = fixtureData.jsonData[17];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "each value in permissions must be one of the following values: all, admins_read, admins_write, sellers_read, sellers_write, inventory_products_read, inventory_products_write, catalog_products_read, catalog_products_write, products_read, products_write, orders_read, orders_write, stores_read, stores_write, files_read, files_write, transactions_read, analytics_read, analytics_write, finance_read, finance_write, settings_read, settings_write",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     // 1.19
     test("signup without email and password", async ({ request }) => {
          const data = fixtureData.jsonData[18];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["email must be an email",
                         "email must be a string",
                         "email should not be empty",
                         "password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     // 1.20
     test("Signup without firstname and lastName", async ({ request }) => {
          const data = fixtureData.jsonData[19];
          const responseBody = await superAdminCreateRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "firstName must be a string",
                         "firstName should not be empty",
                         "lastName must be a string",
                         "lastName should not be empty",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     // 1.21
     test("Signup without request body", async ({ request }) => {
          const data = {};
          const responseBody = await superAdminCreateRequest(request, data, 400);
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


});
