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


};

export const { ADMIN_LOGIN, SELLER_SIGNUP, SELLER_SIGNIN, SELLER_SIGNIN_FOR_STORE } = AUTH_API_ENDPOINTS;
export const { SUPER_ADMIN_CREATE, ADMINS, CURRENT_ADMIN } = ADMIN_API_ENDPOINTS;