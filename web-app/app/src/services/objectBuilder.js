import Category from './../models/category';
import Product from './../models/product';
import User from './../models/user';
import Address from './../models/address'; 
import ProductVariant from './../models/productVariant';
import BlogItem from './../models/BlogItem';
import { RESOURCE } from './../constants';
import { getImageUrlFromProduct } from './../utils';

export default class ObjectBuilder {
  constructor(RestService, AppConstants) {
    'ngInject';

    this.RestService = RestService;
    this.AppConstants = AppConstants;
  }
  buildCategory(data) {
    return new Category(data.id, data.label, data.description);
  }
  buildCategories(data) {
    return data.map((item) => this.buildCategory(item));
  }
  buildProducts(data) {
    return data.map((item) => this.buildProduct(item));
  }
  buildProduct(data) {
    return new Product(data);
  }
  buildUser(data) {
    return new User(data.id, data.name, data.email, data.phone);
  }
  buildUsers(data) {
    return data.map((item) => this.buildUser(item));
  }
  buildProductVariant(data) {
    return new ProductVariant(data);
  }
  buildProductVariants(data) {
    return data.map((item) => this.buildProductVariant(item));
  }
  buildProductItems(data) {
    return data && data.length ? data.map((item) => this.buildProductItem(item)) : [];
  }
  buildProductItem(data) {
    const productItem = new Product(data);
    const imgUrl = getImageUrlFromProduct(this.RestService.getBaseUrl(), data); 
    productItem.imgUrl = imgUrl;
    return productItem;
  }
  buildAddress(data) {
    return new Address(data);
  }
  buildAddresses(data) {
    return data.map((item) => this.buildAddress(item));
  }
  buildBlogItem(data) {
    const baseUrl = this.AppConstants.blogStaticContentUrl;
    return new BlogItem(data, baseUrl);
  }
  buildBlogItems(data) {
    return data && data.length ? data.map((item) => this.buildBlogItem(item)) : [];
  }

  buildObject(key, response) {
    switch(key){
      case RESOURCE.CATEGORY:
        return this.buildCategory(response);
      case RESOURCE.CATEGORIES:
        return this.buildCategories(response);
      case RESOURCE.PRODUCTS:
        return this.buildProducts(response)
      case RESOURCE.PRODUCT:
        return this.buildProduct(response)
      case RESOURCE.USER:
        return this.buildUser(response);
      case RESOURCE.USERS:
        return this.buildUsers(response);
      case RESOURCE.PRODUCT_VARIANTS:
        return this.buildProductVariants(response);
      case RESOURCE.PRODUCT_VARIANT:
        return this.buildProductVariant(response);
      case RESOURCE.PRODUCT_ITEMS:
        return this.buildProductItems(response);
      case RESOURCE.PRODUCT_ITEM:
        return this.buildProductItem(response);
      case RESOURCE.ADDRESS:
        return this.buildAddress(response);
      case RESOURCE.ADDRESSES:
      return this.buildAddresses(response);
      case RESOURCE.BLOG_ITEM:
        return this.buildBlogItem(response);
      case RESOURCE.BLOG_ITEMS:
        return this.buildBlogItems(response);
    }
    return response;
  }
}
