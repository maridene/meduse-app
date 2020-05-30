import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class CategoryService {
  constructor(RestService, $q, ObjectBuilder) {
    this._RestService = RestService;
    this._$q = $q;
    this.ObjectBuilder = ObjectBuilder;
  }

  getAllCategories() {
    const deferred = this._$q.defer();
    this._RestService.get(ApiConstants.CATEGORIES)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.CATEGORIES, result.data)),
            (error) => deferred.reject(error)
        );
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
