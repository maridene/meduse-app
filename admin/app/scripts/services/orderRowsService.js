'use strict';

angular.module('sbAdminApp').service('OrderRowsService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var ORDER_ROWS = 'orderrows';
  return {
    getByOrderId: function getByOrderId(id) {
      var deferred = $q.defer();
      RestService.get("".concat(ORDER_ROWS, "/order/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('orderRows', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    add: function add(order) {
      var deferred = $q.defer();
      RestService.post(ORDER_ROWS, order).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    remove: function remove(id) {
      var deferred = $q.defer();
      RestService.delete("".concat(ORDER_ROWS, "/").concat(id)).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    updateRowQuantity: function updateRowQuantity(id, newQuantity) {
      var deferred = $q.defer();
      RestService.put("".concat(ORDER_ROWS, "/").concat(id).concat("/quantity"), {newQty: newQuantity}).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);