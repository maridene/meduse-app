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
    getByClientId: function getByClientId(id) {
      var deferred = $q.defer();
      RestService.get("".concat(ORDERS, "/client/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('orders', result.data));
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
    },
    search: function search(status, payment, ptype) {
      var deferred = $q.defer();
      var url = ORDERS + '/search?status={0}&payment={1}&ptype={2}';
      url = url.replace('{0}', status)
                .replace('{1}', payment)
                .replace('{2}', ptype);
      RestService.get(url)
        .then(function(result) {
          return deferred.resolve(ObjectBuilder.buildObject('orders', result.data));
        }, function(error) {
          return deferred.reject(error);
        });
      return deferred.promise;
    },
    updateById: function updateById(id, data) {
      var deferred = $q.defer();
      var url = ORDERS + '/' + id;
      RestService.put(url, data)
        .then(function(result) {
          return deferred.resolve();
        }, function(error) {
          return deferred.reject(error);
        });
      return deferred.promise;
    },
    totalInfo: function totalInfo(orderId) {
      var deferred = $q.defer();
      var url = ORDERS + '/' + orderId + '/total';
      RestService.get(url)
        .then(function(result) {
          return deferred.resolve(result.data);
        }, function(error) {
          return deferred.reject(error);
        });
      return deferred.promise;
    },
    create: function create(orderDetails) {
      var deferred = $q.defer();
      var url = ORDERS;
      RestService.post(url, orderDetails)
        .then(function(result) {
          deferred.resolve(result);
        }, function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    applyReduction: function applyReduction(orderId, value) {
      var deferred = $q.defer();
      var url = ORDERS + '/' + orderId + '/reduction/apply';
      RestService.post(url, {reduction: value})
        .then(function(result) {
          deferred.resolve(result);
        }, function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    cancelReduction: function cancelReduction(orderId) {
      var deferred = $q.defer();
      var url = ORDERS + '/' + orderId + '/reduction/cancel';
      RestService.post(url)
        .then(function(result) {
          deferred.resolve(result);
        }, function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    },
    updateOrderAgent: function updateOrderAgent(orderId, agentId) {
      var deferred = $q.defer();
      var url = ORDERS + '/' + orderId + '/agent';
      RestService.put(url, {agentId: agentId})
        .then(function(result) {
          deferred.resolve(result);
        }, function(err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }
  };
}]);