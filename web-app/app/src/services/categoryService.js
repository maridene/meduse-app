import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class CategoryService {
  constructor(RestService, $q, ObjectBuilder) {
    'ngInject';

    this._RestService = RestService;
    this._$q = $q;
    this.ObjectBuilder = ObjectBuilder;
    this.categories = [];
  }

  getAllCategories() {
    const deferred = this._$q.defer();
    if (this.categories.length) {
      deferred.resolve(this.categories);
    } else {
      this._RestService.get(ApiConstants.CATEGORIES)
        .then(
            (result) => {
              this.categories = this.ObjectBuilder.buildObject(RESOURCE.CATEGORIES, result.data); 
              deferred.resolve(this.categories);
            },
            (error) => deferred.reject(error)
        );
    }
    return deferred.promise;
  }
  getCategoryById(id) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.CATEGORIES}`/`${id}`)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.CATEGORY, result.data)),
            (error) => deferred.reject(error));
    return deferred.promise;
  }
  addCategory(category) {
    this._RestService.post(ApiConstants.CATEGORIES, category)
        .then((result) => {

        }, (error) => {

        });
  }
}
