'use strict';

export const RESOURCE = {
  CATEGORY: 'category',
  CATEGORIES: 'categories',
  PRODUCT: 'product',
  PRODUCTS: 'products',
  USERS: 'users',
  USER: 'user',
  PRODUCT_VARIANT: 'product_variant',
  PRODUCT_VARIANTS: 'product_variants',
  PRODUCT_ITEMS: 'product_items',
  PRODUCT_ITEM: 'product_item',
  ADDRESS: 'address',
  ADDRESSES: 'addresses'
};

export const API_CONSTANTS = {
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  PRODUCTS_BY_CATEGORY_ID: 'products/category/{0}?startat={1}&maxresult={2}&orderBy={3}',
  USERS: 'users',
  USERS_REGISTER: 'users/register',
  USERS_AUTHENTICATE: 'users/authenticate',
  USERS_UPDATE: 'users/',
  ADDRESSES: 'addresses/'
};