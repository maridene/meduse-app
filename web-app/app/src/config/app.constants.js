export const AppConstants = {
  api: 'https://meduse.tn/api',
  productsStaticContentUrl: 'https://meduse.tn/static/products/',
  blogStaticContentUrl: 'https://meduse.tn/static/blogs/',
  jwtKey: 'jwtToken',
  appName: 'Meduse.tn',
  reportingEnabled: true
};

export const ApiConstants = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRODUCT_VARAINTS: 'productvariants/product/{0}',
  PRODUCTS_BY_CATEGORY_ID: 'products/category/{0}?startat={1}&maxresult={2}&orderBy={3}',
  MANUFACTURERS: 'manufacturers',
  USERS: 'users',
  USERS_REGISTER: 'users/register',
  USERS_AUTHENTICATE: 'users/authenticate',
  USERS_UPDATE: 'users/update/myself',
  USERS_RESET_PASSWORD: 'users/resetpassword',
  ADDRESSES: 'addresses/',
  BLOGS: 'blogs/',
  BLOGS_TAGS: 'blogs/tags',
  ORDERS: 'orders',
  MY_ORDERS: 'orders/myorders/{0}',
  ORDER_DETAILS: 'orders/myorder/{0}',
  COUPONS: 'coupons',
  SETTINGS: 'settings',
  REPORT: 'report'
};