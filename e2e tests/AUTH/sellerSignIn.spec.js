import { test, expect } from "@playwright/test";
import { SELLER_SIGNIN } from "../../support/apiConstants.js";
import { default_seller_signin } from "../../support/command.js";
import fixtureData from "../../fixtures/AUTH/sellerSignInData.js";

const BASE_URL = process.env.BASE_URL;

const postSellerSignIn = async (request, data) => {
     const response = await request.post(`${BASE_URL}${SELLER_SIGNIN}`, {
          data,
          headers: { "Content-Type": "application/json" },
     });
     return response;
};

const signInRequest = async (request, data, expectedStatus) => {
     const response = await postSellerSignIn(request, data);
     expect(response.status()).toBe(expectedStatus);
     const responseBody = await response.json();
     return responseBody;
};

test.describe("Seller Sign in Test Suite", () => {
     // 3.1
     test("valid seller sign up firstname, lastname, password and invalid email", async ({ request }) => {
          await default_seller_signin(request, BASE_URL);
     });

     //3.2
     test("Sign in with invalid email and valid password", async ({ request }) => {
          const data = fixtureData.jsonData[1];
          const responseBody = await signInRequest(request, data, 401);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Incorrect email or password",
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     //3.3
     test("Sign in with valid email and invalid password", async ({ request }) => {
          const data = fixtureData.jsonData[2];
          const responseBody = await signInRequest(request, data, 401);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: "Incorrect email or password",
                    error: "Unauthorized",
                    statusCode: 401,
               })
          );
     });

     //3.4
     test("Missing Password", async ({ request }) => {
          const { password, ...data } = fixtureData.jsonData[0];
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be shorter than or equal to 100 characters",
                         "password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //3.5
     test("Missing Email", async ({ request }) => {
          const { email, ...data } = fixtureData.jsonData[0];
          const responseBody = await signInRequest(request, data, 400);
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
     });

     //3.5
     test("Invalid password and missing email", async ({ request }) => {
          const data = fixtureData.jsonData[3];
          const responseBody = await signInRequest(request, data, 400);
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
     });


     //3.6
     test("Empty request body", async ({ request }) => {
          const data = {};
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "email must be an email",
                         "email must be a string",
                         "email should not be empty",
                         "password must be shorter than or equal to 100 characters",
                         "password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });


     //3.7
     test("Short Password", async ({ request }) => {
          const data = fixtureData.jsonData[4];
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be longer than or equal to 6 characters"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //3.8
     test("Email with Trailing Spaces", async ({ request }) => {
          const data = fixtureData.jsonData[5];
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "email must be an email"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });

     //3.9
     test("Long password", async ({ request }) => {
          const data = fixtureData.jsonData[6];
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be shorter than or equal to 100 characters"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          );
     });


     //3.10
     test("Null Email", async ({ request }) => {
          const data = fixtureData.jsonData[7];
          const responseBody = await signInRequest(request, data, 400);
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
     });

     //3.11
     test("Null Password", async ({ request }) => {
          const data = fixtureData.jsonData[8];
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be shorter than or equal to 100 characters",
                         "password must be longer than or equal to 6 characters",
                         "password must be a string",
                         "password should not be empty",
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          )
     });

     //3.12
     test("Icorrect type of password", async ({ request }) => {
          const data = fixtureData.jsonData[10];
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "password must be shorter than or equal to 100 characters",
                         "password must be longer than or equal to 6 characters",
                         "password must be a string"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          )
     });

     //3.13
     test("SQL injection or Malicious Input", async ({ request }) => {
          const data = fixtureData.jsonData[11];
          const responseBody = await signInRequest(request, data, 400);
          expect(responseBody).toEqual(
               expect.objectContaining({
                    message: expect.arrayContaining([
                         "email must be an email"
                    ]),
                    error: "Bad Request",
                    statusCode: 400,
               })
          )
     });
}); 
