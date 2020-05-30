import Category from './../models/category';
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

  buildObject(key, response) {
    switch(key){
      case RESOURCE.CATEGORY:
        return this.buildCategory(response);
      case RESOURCE.CATEGORIES:
        return this.buildCategories(response);
    }
    return response;
  }
}
