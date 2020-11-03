import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class CategoryService {
  constructor(RestService, $q, ObjectBuilder) {
    'ngInject';

    this._RestService = RestService;
    this._$q = $q;
    this.ObjectBuilder = ObjectBuilder;
  }

  getMyCoupons() {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.COUPONS}/mycoupons`)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.COUPONS, result.data)),
            (error) => deferred.reject(error)
        );
    return deferred.promise;
  }
  checkCoupon(code) {
    const deferred = this._$q.defer();
    this._RestService.post(`${ApiConstants.COUPONS}/check`, {code})
        .then(
            (result) => deferred.resolve(result),
            (error) => deferred.reject(error));
    return deferred.promise;
  }
  getCoupon() {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.COUPONS}/getacoupon`)
        .then((result) => {
          deferred.resolve(result);
        }, (error) => {
          deferred.reject(error);
        });
    return deferred.promise;
  }
}
