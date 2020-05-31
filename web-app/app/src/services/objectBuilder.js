import Category from './../models/category';
import Product from './../models/product';
import { RESOURCE } from './../constants';

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
    return new Product(data.id, data.label, data.description, data.price, data.quantity, data.video_link, data.category_id);
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
    }
    return response;
  }
}
