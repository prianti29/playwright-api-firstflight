import { test, expect } from "@playwright/test";
import { CURRENT_SELLER } from "../../support/apiConstants.js";
import { default_seller_signin, current_admin_login } from "../../support/command.js";
import { faker } from "@faker-js/faker";
import { BASE_URL } from "../../playwright.config.js";

const authHeaders = (token = null) => {
     const bearerToken = token !== null ? token : process.env.SELLER_ACCESS_TOKEN;
     return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
     };
};

const sendUpdateCurrentSellerRequest = (request, data, token = null) =>
     request.patch(`${BASE_URL}${CURRENT_SELLER}`, {
          headers: authHeaders(token),
          data,
     });

const updateCurrentSellerRequest = async (request, expectedStatus, data, token = null) => {
     const response = await sendUpdateCurrentSellerRequest(request, data, token);
     expect(response.status()).toBe(expectedStatus);
     return response.json();
};

test.describe.serial("Update Current Seller Test Suite", () => {

     //2.1
     test("update current seller with firstname and lastname", async ({ request }) => {
          await default_seller_signin(request, BASE_URL);
          const data = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
          };
          const responseBody = await updateCurrentSellerRequest(request, 200, data);
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
          const isoDateRegex =
               /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

          expect(responseBody.createdAt).toMatch(isoDateRegex);
          expect(responseBody.updatedAt).toMatch(isoDateRegex);

          // validate profilePhoto Object
          if (responseBody.profilePhoto) {
               expect(responseBody.profilePhoto).toEqual(
                    expect.objectContaining({
                         id: expect.any(String),
                         url: expect.stringContaining("https://"),
                         createdAt: expect.any(String),
                         updatedAt: expect.any(String),
                         variants: expect.objectContaining({
                              tiny: expect.objectContaining({
                                   url: expect.stringContaining("https://"),
                              }),
                         }),
                    })
               );
               expect(responseBody.profilePhoto.createdAt).toMatch(isoDateRegex);
               expect(responseBody.profilePhoto.updatedAt).toMatch(isoDateRegex);
          }
     });

     //2.2
     test("unauthorized to update current seller email", async ({ request }) => {
          const invalidToken = "invalid_token_12345";
          const responseBody = await updateCurrentSellerRequest(request, 401, { email: "test@example.com" }, invalidToken);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Invalid access token"),
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     //2.3
     test("update current seller profilePhotoId", async ({ request }) => {
          const adminToken = await current_admin_login(request, BASE_URL);
          const responseBody = await updateCurrentSellerRequest(request, 200, { profilePhotoId: "m880hg5nirzbou7edaonm85i" }, adminToken);
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
     });

     // //2.4
     // test("update current seller profilePhotoId", async ({ request }) => {
     //      const adminToken = await current_admin_login(request, BASE_URL);
     //      const responseBody = await updateCurrentSellerRequest(request, 403, {}, adminToken);
     //      expect(responseBody).toEqual(
     //           expect.objectContaining({
     //                message: expect.stringContaining("Forbidden resource"),
     //                error: "Forbidden",
     //                statusCode: 403,
     //           })
     //      );
     // });

});
