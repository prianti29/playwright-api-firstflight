// Test data constants
const VALID_EMAIL = "rezwankabirrobin@gmail.com";
const VALID_PASSWORD = "11111111";
const INVALID_EMAIL_1 = "john@gmail.com";
const INVALID_EMAIL_2 = "robin.rezwan";
const VALID_EMAIL_2 = "robin.rezwan@gmail.com";
const DEFAULT_PASSWORD = "12345678";
const SHORT_PASSWORD = "2656";
const WRONG_PASSWORD = "123456";
const INVALID_PASSWORD = "asfrasdf";

// Test case data organized by scenario
const testCases = {
     // Valid credentials - Test 1.1
     validCredentials: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
     },
     // Short password - Test 1.2
     shortPassword: {
          email: VALID_EMAIL,
          password: SHORT_PASSWORD,
     },
     // Invalid credentials - Test 1.3
     invalidCredentials: {
          email: INVALID_EMAIL_1,
          password: WRONG_PASSWORD,
     },
     // Invalid email format - Test 1.4
     invalidEmailFormat: {
          email: INVALID_EMAIL_2,
          password: DEFAULT_PASSWORD,
     },
     // Valid email with incorrect password - Test 1.5
     validEmailWrongPassword: {
          email: VALID_EMAIL_2,
          password: INVALID_PASSWORD,
     },
     // Missing email - Test 1.6
     missingEmail: {
          password: DEFAULT_PASSWORD,
     },
     // Missing password - Test 1.7
     missingPassword: {
          email: VALID_EMAIL,
     },
     // SQL injection attempt - Test 1.9
     sqlInjection: {
          email: "' OR '1'='1",
          password: DEFAULT_PASSWORD,
     },
};

// Export in original format for backward compatibility
export default {
     jsonData: [
          testCases.validCredentials,        // index 0 - Test 1.1
          testCases.shortPassword,            // index 1 - Test 1.2
          testCases.invalidCredentials,       // index 2 - Test 1.3
          testCases.invalidEmailFormat,       // index 3 - Test 1.4
          testCases.validEmailWrongPassword,  // index 4 - Test 1.5
          testCases.missingEmail,             // index 5 - Test 1.6
          testCases.missingPassword,          // index 6 - Test 1.7
          testCases.sqlInjection,             // index 7 - Test 1.9
     ],
};


