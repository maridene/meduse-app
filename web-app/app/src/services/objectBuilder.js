import Category from './../models/category';
import Product from './../models/product';
import User from './../models/user'; 
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
  buildUser(data) {
    return new User(data.id, data.name, data.email, data.phone);
  }
  buildUsers(data) {
    return data.map((item) => this.buildUser(item));
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
    }
    return response;
  }
}
