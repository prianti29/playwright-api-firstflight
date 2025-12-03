## Playwright API Test Suite

This repository contains an API-focused test suite built with **Playwright Test**. It verifies authentication and authorization flows for different user types (admin, seller, seller staff store) against the `pengine` API.

---

## Project Structure

- **`e2e tests/`**: All Playwright test specs
  - `AUTH/adminLogin.spec.js` – admin login scenarios
  - `AUTH/sellerSignIn.spec.js` – seller sign-in scenarios
  - `AUTH/sellerSignInForStore.spec.js` – seller sign-in for store / staff store scenarios
- **`fixtures/AUTH/`**: Test data (fixtures)
  - `adminLoginData.js`
  - `sellerSignIn.js`
  - `sellerSignUpData.js`
- **`support/`**
  - `apiConstants.js` – API endpoint constants
  - `command.js` – reusable helper functions
  - `e2e.js` – (reserved for shared e2e helpers)
- **`playwright.config.js`** – Playwright configuration
- **`playwright-report/`** – HTML reports (generated)
- **`test-results/`** – Raw test output (generated)

---

## Prerequisites

- **Node.js** 18+ (recommended)
- **npm** 8+ or compatible package manager

---

## Installation

From the project root:

```bash
npm install
```

This installs:

- `@playwright/test`
- `@faker-js/faker`
- `@types/node`

---

## Configuration & Environment

Playwright base URL is configured in `playwright.config.js`:

```js
use: {
  BASE_URL: process.env.API_BASE_URL || 'https://api.pengine.dev/v1',
}
```

### Required Environment Variables

Set these before running tests (e.g. in your shell, `.env`, or CI):

- **`API_BASE_URL`** – API base URL (optional; falls back to `https://api.pengine.dev/v1`)
- **`SUPER_ADMIN_ACCESS_TOKEN`** – set dynamically by `super_admin_login` helper
- **`SELLER_ACCESS_TOKEN`** – set dynamically by `default_seller_signin` / `seller_signin_for_staff_store`

You typically **do not** need to pre-populate the tokens locally; the helper functions in `support/command.js` will obtain and store them in `process.env` when called.

---

## Running Tests

From the project root:

```bash
npx playwright test
```

### Run a Single Spec

Example – run only seller sign-in tests:

```bash
npx playwright test "e2e tests/AUTH/sellerSignIn.spec.js"
```

Example – run seller sign-in for store tests:

```bash
npx playwright test "e2e tests/AUTH/sellerSignInForStore.spec.js"
```

> On Windows PowerShell, always **quote the path** so it’s treated as a single argument and valid regex.

---

## Fixtures

Fixtures live under `fixtures/AUTH/` and export a default object of the shape:

```js
export default {
  jsonData: [
    // scenario objects...
  ],
};
```

They are optimized for:

- Reuse across multiple tests
- Clear mapping between **index** and **test case**
- Consistency via shared constants (email/password values)

Use them in tests via:

```js
import fixtureData from "../../fixtures/AUTH/sellerSignIn.js";
const data = fixtureData.jsonData[0];
```

---

## Reports

After a test run, Playwright generates an HTML report:

```bash
npx playwright show-report
```

This opens the report (by default from `playwright-report/`) in your browser.

---

## Common Issues

- **“No tests found”**
  - Ensure you quote the test path in CLI, e.g.:
    ```bash
    npx playwright test "e2e tests/AUTH/adminLogin.spec.js"
    ```
- **“Cannot find module '../../support/apiConstants.js'”**
  - Check the **relative path** from the spec file and ensure it matches the actual folder structure.
- **`expect(response.ok()).toBeTruthy()` fails**
  - The API returned a non-2xx status. Log `response.status()` and `await response.text()` to inspect the backend error and adjust the test or data accordingly.

---

## Extending the Suite

When adding new tests:

1. Reuse or extend existing fixtures under `fixtures/AUTH/`.
2. Add new helper flows in `support/command.js` if multiple specs will share them.
3. Keep imports **relative to the project root layout** as shown in existing specs.

This keeps the suite maintainable and consistent as it grows.
