import { test, expect } from "@playwright/test";
import { CURRENT_SELLER } from "../../support/apiConstants.js";
import { default_seller_signin, current_admin_login } from "../../support/command.js";

const BASE_URL = process.env.BASE_URL;

const authHeaders = () => ({
     "Content-Type": "application/json",
     Authorization: `Bearer ${process.env.SELLER_ACCESS_TOKEN}`,
});
const getCurrentSellerRequest = (request, data) =>
     request.patch(`${BASE_URL}${CURRENT_SELLER}`, {
          headers: authHeaders(),
          data,
     });
const getRequest = async (request, expectedStatus, data) => {
     const response = await getCurrentSellerRequest(request, data);
     expect(response.status()).toBe(expectedStatus);
     return response.json();
};

test.describe.serial("Update Current Seller Test Suite", () => {

     //1.1
     test("update current seller with firstname and lastname", async ({ request }) => {
          await default_seller_signin(request, BASE_URL);
          const data = {
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
          };
          const responseBody = await getRequest(request, 200, data);
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

          // Validate stores
          expect(responseBody.stores.length).toBeGreaterThan(0);

          responseBody.stores.forEach((store) => {
               expect(store).toEqual(
                    expect.objectContaining({
                         id: expect.any(String),
                         name: expect.any(String),
                         isActive: expect.any(Boolean),
                         createdAt: expect.any(String),
                         updatedAt: expect.any(String),
                    })
               );

               expect(store.createdAt).toMatch(isoDateRegex);
               expect(store.updatedAt).toMatch(isoDateRegex);
          });
     });

     //1.2
     test("Get current seller with invalid seller access token", async ({ request }) => {
          const invalidToken = process.env.INVALID_ACCESS_TOKEN;
          const responseBody = await getRequest(request, 401, invalidToken);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Invalid access token"),
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     //1.3
     test("Forbidden to get current seller with admin access token", async ({ request }) => {
          await current_admin_login(request, BASE_URL);
          const authHeaders = () => ({
               "Content-Type": "application/json",
               Authorization: `Bearer ${process.env.CURRENT_ADMIN_ACCESS_TOKEN}`,
          });
          const responseBody = await getRequest(request, 401, authHeaders());
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.stringContaining("Invalid access token"),
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

})
