'use strict';

angular.module('sbAdminApp').service('ManufacturerService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var MANUFACTURERS = 'manufacturers';
  return {
    getAll: function getAll() {
      var deferred = $q.defer();
      RestService.get(MANUFACTURERS).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('manufacturers', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    getById: function getById(id) {
      var deferred = $q.defer();
      RestService.get("".concat(MANUFACTURERS, "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('manufacturer', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    add: function add(manufacturer) {
      var deferred = $q.defer();
      RestService.post(MANUFACTURERS, manufacturer).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    remove: function remove(id) {
      var deferred = $q.defer();
      RestService.delete("".concat(MANUFACTURERS, "/").concat(id)).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    update: function update(id, manufacturer) {
      var deferred = $q.defer();
      RestService.put("".concat(MANUFACTURERS, "/").concat(id), manufacturer).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);