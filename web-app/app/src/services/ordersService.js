import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class OrdersService {
  constructor(RestService, $q, ObjectBuilder, $rootScope) {
    'ngInject';

    this._RestService = RestService;
    this._$q = $q;
    this.ObjectBuilder = ObjectBuilder;
    this.$rootScope = $rootScope;
  }

  getMyOrders() {
    const deferred = this._$q.defer();
    const userId = this.$rootScope.globals && this.$rootScope.globals.currentUser ? this.$rootScope.globals.currentUser.id : null;
    if (userId === null) {
      deferred.reject();
      return deferred.promise;
    }
    this._RestService.get(ApiConstants.MY_ORDERS.replace('{0}', userId))
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.ORDERS, result.data)),
            (error) => deferred.reject(error)
        );
    return deferred.promise;
  }

  getOrderDetails(id) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.MY_ORDERS}/${id}`)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.MY_ORDERS, result.data)),
            (error) => deferred.reject(error)
        );
    return deferred.promise;
  }

  submitOrder(orderDetails) {
    const deferred = this._$q.defer();
    this._RestService.post(`${ApiConstants.ORDERS}/submit`, orderDetails)
        .then(
            (result) => deferred.resolve(result),
            (error) => deferred.reject(error));
    return deferred.promise;
  }
  
  getById(id) {
    const deferred = this._$q.defer();
    this._RestService.get(ApiConstants.ORDER_DETAILS.replace('{0}', id))
        .then((result) => {
          deferred.resolve(result.data);
        }, (error) => {
          deferred.reject(error);
        });
    return deferred.promise;
  }
}
