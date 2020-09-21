'use strict';

angular.module('sbAdminApp')
  .service('OrdersService', ['$q', 'ObjectBuilder', 'RestService', function($q, ObjectBuilder, RestService) {
    const ORDERS = 'orders';
    return {
      getAll() {
        const deferred = $q.defer();
        RestService.get(ORDERS)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('orders', result.data)),
                (error) => deferred.reject(error)
            );
        return deferred.promise;
      },
      getById(id) {
        const deferred = $q.defer();
        RestService.get(`${ORDERS}/${id}`)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('order', result.data)),
                (error) => deferred.reject(error));
        return deferred.promise;
      },
      add(order) {
        const deferred = $q.defer();
        RestService.post(ORDERS, order)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      },
      remove(id) {
        const deferred = $q.defer();
        RestService.delete(`${ORDERS}/${id}`)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      }
    }
  }]);

