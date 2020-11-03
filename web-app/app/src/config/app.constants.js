const AppConstants = {
  api: 'http://meduse.tn/api',
  productsStaticContentUrl: 'http://meduse.tn/static/products/',
  blogStaticContentUrl: 'http://meduse.tn/static/blogs/',
  jwtKey: 'jwtToken',
  appName: 'Meduse.tn',
};

export const ApiConstants = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRODUCT_VARAINTS: 'productvariants/product/{0}',
  PRODUCTS_BY_CATEGORY_ID: 'products/category/{0}?startat={1}&maxresult={2}&orderBy={3}',
  USERS: 'users',
  USERS_REGISTER: 'users/register',
  USERS_AUTHENTICATE: 'users/authenticate',
  USERS_UPDATE: 'users/',
  ADDRESSES: 'addresses/',
  BLOGS: 'blogs/',
  ORDERS: 'orders',
  MY_ORDERS: 'orders/myorders/{0}',
  COUPONS: 'coupons'
};

export default AppConstants;