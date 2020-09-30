'use strict';

angular.module('sbAdminApp').service('ClientsService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var CLIENTS = 'clients';
  return {
    getAll: function getAll() {
      var deferred = $q.defer();
      RestService.get(CLIENTS).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('clients', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    getId: function getId(id) {
      var deferred = $q.defer();
      RestService.get("".concat(CLIENTS, "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('client', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    add: function add(client) {
      var deferred = $q.defer();
      RestService.post(CLIENTS, client).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    remove: function remove(id) {
      var deferred = $q.defer();
      RestService.delete("".concat(CLIENTS, "/").concat(id)).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);