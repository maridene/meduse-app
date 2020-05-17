import {RESOURCE} from "../constants";
import Category from "../models/category";

angular.module('meduseApp.core.objectbuilder', [])
  .service('ObjectBuilder', () => {
    const buildCategory = (data) => new Category(data.id, data.label, data.description);
    const buildCategories = (data) =>
        data.map((item) => buildCategory(item));
    return {
      buildObject(key, response) {
        switch(key){
          case RESOURCE.CATEGORY:
            return buildCategory(response);
          case RESOURCE.CATEGORIES:
            return buildCategories(response);
        }
        return response;
      }
    }
  });