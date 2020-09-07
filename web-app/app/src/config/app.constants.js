const AppConstants = {
  api: 'http://localhost:3000/api',
  jwtKey: 'jwtToken',
  appName: 'MEDUSE',
};

export const ApiConstants = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRODUCTS_BY_CATEGORY_ID: 'products/category/{0}?startat={1}&maxresult={2}&orderBy={3}',
  USERS: 'users',
  USERS_REGISTER: 'users/register',
  USERS_AUTHENTICATE: 'users/authenticate',
  USERS_UPDATE: 'users/',
  ADDRESSES: 'addresses/'
};

export default AppConstants;