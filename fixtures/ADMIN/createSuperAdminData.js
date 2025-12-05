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
     anotherEmailAndPassword: {
          email: "another@gmail.com",
          password: "123456789",
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     withoutEmail: {
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     withoutPassword: {
          email: VALID_EMAIL,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     withoutFirstName: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     withoutLastName: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          permissions: PERMISSIONS,
     },
     withoutPermissions: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
     },
     nullValueOnEmail: {
          email: null,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     nullValueOnPassword: {
          email: VALID_EMAIL,
          password: null,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     nullValueOnFirstName: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: null,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     nullValueOnLastName: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: null,
          permissions: PERMISSIONS,
     },
     nullValueOnPermissions: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: null,
     },
     nullValueOnAll: {
          email: null,
          password: null,
          firstName: null,
          lastName: null,
          permissions: null,
     },
     emptyStringOnFirstName: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: "",
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     emptyStringOnLastName: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: "",
          permissions: PERMISSIONS,
     },
     emptyStringOnEmail: {
          email: "",
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     emptyStringOnPassword: {
          email: VALID_EMAIL,
          password: "",
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     emptyStringOnPermissions: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: [""],
     },
     withoutEmailAndPassword: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          permissions: PERMISSIONS,
     },
     withoutFirstNameAndLastName: {
          email: VALID_EMAIL,
          password: VALID_PASSWORD,
          permissions: PERMISSIONS,
     },

};

// Export in original format for backward compatibility
export default {
     jsonData: [
          testCases.existingSuperAdmin,      // index 0 - Test 1.1
          testCases.anotherEmailAndPassword, // index 1 - Test 1.2
          testCases.withoutEmail,            // index 2 - Test 1.3
          testCases.withoutPassword,         // index 3 - Test 1.4
          testCases.withoutFirstName,        // index 4 - Test 1.5
          testCases.withoutLastName,         // index 5 - Test 1.6
          testCases.withoutPermissions,      // index 6 - Test 1.7
          testCases.nullValueOnEmail,        // index 7 - Test 1.8
          testCases.nullValueOnPassword,     // index 8 - Test 1.9
          testCases.nullValueOnFirstName,    // index 9 - Test 1.10
          testCases.nullValueOnLastName,     // index 10 - Test 1.11
          testCases.nullValueOnPermissions,  // index 11 - Test 1.12
          testCases.nullValueOnAll,          // index 12 - Test 1.13
          testCases.emptyStringOnFirstName,  // index 13 - Test 1.14
          testCases.emptyStringOnLastName,  // index 14 - Test 1.15
          testCases.emptyStringOnEmail,  // index 15 - Test 1.16
          testCases.emptyStringOnPassword,  // index 16 - Test 1.17
          testCases.emptyStringOnPermissions,  // index 17 - Test 1.18
          testCases.withoutEmailAndPassword,  // index 18 - Test 1.19
          testCases.withoutFirstNameAndLastName,  // index 19 - Test 1.20
     ],
};


