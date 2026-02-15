# Pengine API Test Case

## Description

A Playwright-based testing suite for API testing and validation. This repository contains an API-focused test suite built with **Playwright Test** that verifies authentication and authorization flows for different user types (admin, seller, seller staff store) against the `pengine` API.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/playwright-api-firstflight.git
   ```

2. Navigate to the project directory:

   ```bash
   cd playwright-api-firstflight
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   This installs:

   - `@playwright/test`
   - `@faker-js/faker`
   - `@types/node`

4. Set up environment variables:

   - Create a `.env` file in the project root (optional):

     ```bash
     touch .env
     ```

   - Update the `.env` file with your API configuration:

     ```
     API_BASE_URL=https://api.pengine.dev/v1
     ```

   > **Note**: If `API_BASE_URL` is not set, the tests will default to `https://api.pengine.dev/v1`. Access tokens (`SUPER_ADMIN_ACCESS_TOKEN`, `SELLER_ACCESS_TOKEN`) are set dynamically by helper functions and typically do not need to be pre-populated.

## Prerequisites

- **Node.js** 18+ (recommended)
- **npm** 8+ or compatible package manager

## Usage

- **Running Tests**:

  - Run all tests in headless mode (ideal for CI/CD):

    ```bash
    npx playwright test
    ```

  - Run tests in UI mode for interactive test development and debugging:

    ```bash
    npx playwright test --ui
    ```

  - Run a specific test file:

    ```bash
    npx playwright test "e2e tests/AUTH/sellerSignIn.spec.js"
    ```

  - Run tests for a specific feature area:

    ```bash
    npx playwright test "e2e tests/AUTH/"
    ```

  > **Note**: On Windows PowerShell, always **quote the path** so it's treated as a single argument.

## Project Structure

- `e2e tests/`: Contains test specification files organized by feature area.
- `fixtures/`: Stores test data fixtures organized to match the `e2e tests/` structure.
- `support/`: Includes custom commands, utilities, and helper functions.
- `tests-examples/`: Contains example or demo test files for reference.
- `playwright.config.js`: Playwright configuration file.
- `package.json`: npm package configuration.

## Test Reports

Test results and artifacts are automatically generated in:

- `playwright-report/`: HTML test reports with detailed test results, screenshots, and traces.
- `test-results/`: Raw test output including screenshots, videos, and trace files.

To view the HTML report:

```bash
npx playwright show-report
```

This opens the report (by default from `playwright-report/`) in your browser.

## Configuration & Environment

Playwright base URL is configured in `playwright.config.js`:

```js
use: {
  BASE_URL: process.env.API_BASE_URL || 'https://api.pengine.dev/v1',
}
```

### Environment Variables

- **`API_BASE_URL`** – API base URL (optional; falls back to `https://api.pengine.dev/v1`)
- **`SUPER_ADMIN_ACCESS_TOKEN`** – set dynamically by `super_admin_login` helper
- **`SELLER_ACCESS_TOKEN`** – set dynamically by `default_seller_signin` / `seller_signin_for_staff_store`

You typically **do not** need to pre-populate the tokens locally; the helper functions in `support/command.js` will obtain and store them in `process.env` when called.

## Fixtures

Fixtures live under `fixtures/` and export a default object of the shape:

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
import fixtureData from "../../fixtures/AUTH/sellerSignInData.js";
const data = fixtureData.jsonData[0];
```

## Common Issues

- **"No tests found"**
  - Ensure you quote the test path in CLI, e.g.:
    ```bash
    npx playwright test "e2e tests/AUTH/adminLogin.spec.js"
    ```
- **"Cannot find module '../../support/apiConstants.js'"**
  - Check the **relative path** from the spec file and ensure it matches the actual folder structure.
- **`expect(response.ok()).toBeTruthy()` fails**
  - The API returned a non-2xx status. Log `response.status()` and `await response.text()` to inspect the backend error and adjust the test or data accordingly.

## Contributing

1. Fork the repository to your GitHub account

2. Create a new feature branch:

   ```bash
   git checkout -b feature/new-test
   ```

3. Add your tests and make necessary changes

   - When adding new tests:
     - Reuse or extend existing fixtures under `fixtures/`
     - Add new helper flows in `support/command.js` if multiple specs will share them
     - Keep imports **relative to the project root layout** as shown in existing specs
     - Create new feature subdirectories in `e2e tests/` and `fixtures/` as needed

4. Commit your changes:

   ```bash
   git commit -m 'Add new API test'
   ```

5. Push the changes to your fork:

   ```bash
   git push origin feature/new-test
   ```

6. Open a pull request:

   - Navigate to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Provide a clear description of your changes
   - Submit the pull request for review

## License

This project is licensed under the [ISC License](LICENSE).
