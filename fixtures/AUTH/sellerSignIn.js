// Test data constants
const VALID_EMAIL = "rezwankabirrobin@gmail.com";
const VALID_PASSWORD = "11111111";
const INVALID_EMAIL = "priantibanik100@gmail.com";
const WRONG_PASSWORD = "123456";
const DEFAULT_PASSWORD = "12345678";

// Helper function to generate long password (exceeds 100 char limit)
const generateLongPassword = () => "A".repeat(101);

// Test case data organized by scenario
const testCases = {
     // Valid credentials - Test 3.1, 3.4
     validCredentials: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
     },
     // Invalid email - Test 3.2
     invalidEmail: {
          email: INVALID_EMAIL,
          password: VALID_PASSWORD,
     },
     // Invalid password - Test 3.3
     invalidPassword: {
          email: VALID_EMAIL,
          password: WRONG_PASSWORD,
     },
     // Missing email - Test 3.5
     missingEmail: {
          password: "passwordcxzcv",
     },
     // Short password - Test 3.7
     shortPassword: {
          email: VALID_EMAIL,
          password: "123",
     },
     // Email with trailing spaces - Test 3.8
     emailWithSpaces: {
          email: `   ${VALID_EMAIL}`,
          password: VALID_PASSWORD,
     },
     // Long password - Test 3.9
     longPassword: {
          email: VALID_EMAIL,
          password: generateLongPassword(),
     },
     // Null email - Test 3.10
     nullEmail: {
          email: null,
          password: DEFAULT_PASSWORD,
     },
     // Null password - Test 3.11
     nullPassword: {
          email: VALID_EMAIL,
          password: null,
     },
     // Wrong email type - Test 3.12
     wrongEmailType: {
          email: 123,
          password: DEFAULT_PASSWORD,
     },
     // Wrong password type - Test 3.13
     wrongPasswordType: {
          email: "abc@sharklasers.com",
          password: 12345678,
     },
     // SQL injection attempt - Test 3.14
     sqlInjection: {
          email: "' OR 1=1 --",
          password: VALID_PASSWORD,
     },
};

// Export in original format for backward compatibility
export default {
     jsonData: [
          testCases.validCredentials,      // index 0 - Test 3.1, 3.4
          testCases.invalidEmail,          // index 1 - Test 3.2
          testCases.invalidPassword,       // index 2 - Test 3.3
          testCases.missingEmail,          // index 3 - Test 3.5
          testCases.shortPassword,         // index 4 - Test 3.7
          testCases.emailWithSpaces,       // index 5 - Test 3.8
          testCases.longPassword,          // index 6 - Test 3.9
          testCases.nullEmail,            // index 7 - Test 3.10
          testCases.nullPassword,         // index 8 - Test 3.11
          testCases.wrongEmailType,       // index 9 - Test 3.12
          testCases.wrongPasswordType,    // index 10 - Test 3.13
          testCases.sqlInjection,         // index 11 - Test 3.14
     ],
};


