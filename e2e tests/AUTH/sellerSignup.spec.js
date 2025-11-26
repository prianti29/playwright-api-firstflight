import { test, expect } from "@playwright/test";
import { SELLER_SIGNUP } from "../../support/apiConstants.js";


const config = require("../../playwright.config.js");
const BASE_URL = config.use?.BASE_URL;

test.describe("Seller signup Tests", () => {


     // 1.2
     test("seller sign up with valid firstname, lastname, email, password", async ({ request }) => {
          const Data = fixtureData.jsonData[1];

          const response = await request.post(`${BASE_URL}${SELLER_SIGNUP}`, {
               data: Data,
               headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`
               }
          });
          const responseBody = await response.json();
          expect(response.status()).toBe(400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining(["password must be longer than or equal to 6 characters"]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

}); 
