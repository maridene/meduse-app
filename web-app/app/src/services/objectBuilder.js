import Category from './../models/category';
import Product from './../models/product';
import User from './../models/user'; 
import ProductVariant from './../models/productVariant';
import { RESOURCE } from './../constants';
import { getImageFromBuffer } from './../utils';

export default class ObjectBuilder {
  constructor() {

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
  buildImage(data) {
    return {sku: data.sku, image: getImageFromBuffer(data.image.data)};
  }
  buildImages(data) {
    return data && data.length ? data.map((item) => this.buildImage(item)) : [];
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
      case RESOURCE.IMAGES:
        return this.buildImages(response);
        case RESOURCE.IMAGE:
          return this.buildImage(response);
    }
    return response;
  }
}
