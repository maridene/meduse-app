import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class ProductService {
  constructor(RestService, $q, ObjectBuilder) {
    'ngInject';

    this._RestService = RestService;
    this._$q = $q;
    this.ObjectBuilder = ObjectBuilder;
  }

  getProductById(id) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}`/`${id}`)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCT, result.data)),
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  getProductsByCategory(categoryId) {
    const deferred = this._$q.defer();
    this._RestService.get(ApiConstants.PRODUCTS_BY_CATEGORY_ID + categoryId)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCTS, result.data)),
            (error) => deferred.reject(error)
        );
    return deferred.promise;
  }
  addProduct(product) {
    this._RestService.post(ApiConstants.PRODUCTS, product)
        .then((result) => {

        }, (error) => {

        });
  }
}
