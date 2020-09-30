'use strict';

angular.module('sbAdminApp').service('OrdersService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var ORDERS = 'orders';
  return {
    getAll: function getAll() {
      var deferred = $q.defer();
      RestService.get(ORDERS).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('orders', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    getById: function getById(id) {
      var deferred = $q.defer();
      RestService.get("".concat(ORDERS, "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('order', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    add: function add(order) {
      var deferred = $q.defer();
      RestService.post(ORDERS, order).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    remove: function remove(id) {
      var deferred = $q.defer();
      RestService.delete("".concat(ORDERS, "/").concat(id)).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);