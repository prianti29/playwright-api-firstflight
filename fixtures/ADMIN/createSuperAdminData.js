// Test data constants
const VALID_EMAIL = "rezwankabirrobin@gmail.com";
const VALID_PASSWORD = "11111111";
const FIRST_NAME = "Robin";
const LAST_NAME = "Rezwan";
const PERMISSIONS = ["all"];

// Helper function to generate long password (exceeds 100 char limit)
const generateLongPassword = () => "A".repeat(101);

// Test case data organized by scenario
const testCases = {
     // 1.1
     existingSuperAdmin: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
};

// Export in original format for backward compatibility
export default {
     jsonData: [
          testCases.existingSuperAdmin,      // index 0 - Test 1.1
     ],
};


