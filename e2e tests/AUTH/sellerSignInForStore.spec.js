import { test, expect } from "@playwright/test";
import { seller_signin_for_staff_store, default_seller_signin, super_admin_login } from "../../support/command.js";
import { SELLER_SIGNIN_FOR_STORE } from "../../support/apiConstants.js";
import config from "../../playwright.config.js";

const BASE_URL = config.use?.BASE_URL;
const validStoreId = 'gsso0e05ljljvf3jafnzfd51';
const invalidStoreId = 'gsso0e05ljljvf3jafnzfd5123565989';
test.describe("Seller Sign In For Staff Store Tests", () => {

     test.beforeEach(async ({ request }) => {
          await default_seller_signin(request, BASE_URL);
     });

     // 4.1
     test("seller sign in for store with valid seller store id", async ({ request }) => {
          await seller_signin_for_staff_store(request, BASE_URL);
     });

     //4.2
     test("seller sign in  for store invalid seller store id", async ({ request }) => {
          const response = await request.post(`${BASE_URL}${SELLER_SIGNIN_FOR_STORE}/${invalidStoreId}`, {
               headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.SELLER_ACCESS_TOKEN}`,
               }
          });
          expect(response.status()).toBe(401);
          expect(await response.json()).toEqual(
               expect.objectContaining({
                    message: "Unauthorized to access this store",
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     //4.3
     test("seller sign in  for store with admin access", async ({ request }) => {
          await super_admin_login(request, BASE_URL);
          const response = await request.post(`${BASE_URL}${SELLER_SIGNIN_FOR_STORE}/${validStoreId}`, {
               headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.SUPER_ADMIN_ACCESS_TOKEN}`,
               }
          });
          expect(response.status()).toBe(403);
          expect(await response.json()).toEqual(
               expect.objectContaining({
                    message: "Forbidden resource",
                    error: "Forbidden",
                    statusCode: 403,
               })
          );
     });

     //4.4
     test("seller signin for store without store id", async ({ request }) => {
          const response = await request.post(`${BASE_URL}${SELLER_SIGNIN_FOR_STORE}/asd`, {
               headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.SELLER_ACCESS_TOKEN}`,
               }
          });
          expect(response.status()).toBe(401);
          expect(await response.json()).toEqual(
               expect.objectContaining({
                    message: "Unauthorized to access this store",
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });
}); 
