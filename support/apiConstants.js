// AUTH API ENDPOINTS
const AUTH_API_ENDPOINTS = {
    ADMIN_LOGIN: '/auth/admins/signin',
    SELLER_SIGNUP: '/auth/sellers/signup',
    SELLER_SIGNIN: '/auth/sellers/signin',
    SELLER_SIGNIN_FOR_STORE: '/auth/sellers/signin/stores',

};

//ADMIN API ENDPOINTS
const ADMIN_API_ENDPOINTS = {
    SUPER_ADMIN_CREATE: '/admins/super',
    ADMINS: '/admins',
    CURRENT_ADMIN: '/admins/current',
    UPDATE_CURRENT_ADMIN_PASSWORD: '/admins/current/password',


};

//FILES API ENDPOINTS
const FILES_API_ENDPOINTS = {
    FILES_PROFILES: '/files/profiles',
};

export const { ADMIN_LOGIN, SELLER_SIGNUP, SELLER_SIGNIN, SELLER_SIGNIN_FOR_STORE } = AUTH_API_ENDPOINTS;
export const { SUPER_ADMIN_CREATE, ADMINS, CURRENT_ADMIN, UPDATE_CURRENT_ADMIN_PASSWORD } = ADMIN_API_ENDPOINTS;
export const { FILES_PROFILES } = FILES_API_ENDPOINTS;