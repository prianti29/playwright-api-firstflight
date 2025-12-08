// Test data constants
const FIRST_NAME = "TEST";
const LAST_NAME = "TEST";
const EMAIL = "test@test.com";
const DESIGNATION = "admin";
const PERMISSIONS = ["admins_read", "admins_write"];
const PASSWORD = "12345678";
const IS_ACTIVE = true;


// Test case data organized by scenario
const testCases = {
     AllFields: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     emptyFirstNameAndLastName: {
          firstName: "",
          lastName: "",
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     permitWithAll: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: ["all"],
          isActive: IS_ACTIVE
     },
     invalidPermission: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: ["invalid"],
          isActive: IS_ACTIVE
     },
     emptyFirstName: {
          firstName: "",
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     emptyLastName: {
          firstName: FIRST_NAME,
          lastName: "",
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     emptyEmail: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: "",
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     emptyPassword: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: "",
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     emptyPermission: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: [""],
          isActive: IS_ACTIVE
     },
     invalidPassword: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: 123,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     shortPassword: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: "123",
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     invalidEmail: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: "invalid",
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     },
     duplicateEmail: {
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          email: EMAIL,
          designation: DESIGNATION,
          password: PASSWORD,
          permissions: PERMISSIONS,
          isActive: IS_ACTIVE
     }

};

// Export in original format for backward compatibility
export default {
     jsonData: [
          testCases.AllFields,      // index 0 - Test 2.2-2.6,2.10-2.12, 2.14,2.15,2.29
          testCases.emptyFirstNameAndLastName,      // index 1 - Test 2.7
          testCases.permitWithAll,      // index 2 - Test 2.8
          testCases.invalidPermission,      // index 3 - Test 2.9
          testCases.emptyFirstName,      // index 4 - Test 2.17
          testCases.emptyLastName,      // index 5 - Test 2.18
          testCases.emptyEmail,      // index 6 - Test 2.19
          testCases.emptyPassword,      // index 7 - Test 2.21
          testCases.emptyPermission,      // index 8 - Test 2.22
          testCases.invalidPassword,      // index 9 - Test 2.23
          testCases.shortPassword,      // index 10 - Test 2.24
          testCases.invalidEmail,      // index 11 - Test 2.25
          testCases.duplicateEmail,      // index 12 - Test 2.25
     ],
};


