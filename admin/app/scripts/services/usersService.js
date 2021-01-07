'use strict';

angular.module('sbAdminApp').service('UsersService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var CLIENTS = 'users/clients';
  var ADMINS = 'users/admins';
  var USERS = 'users';
  var ADD_USER = 'users/register';
  var ADD_ADMIN = 'users/register-admin';
  var ADDRESSES = 'addresses';
  return {
    getAllClients: function getAll() {
      var deferred = $q.defer();
      RestService.get(CLIENTS).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('clients', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    getById: function getById(id) {
      var deferred = $q.defer();
      RestService.get("".concat(CLIENTS, "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('client', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    addClient: function addClient(client) {
      var deferred = $q.defer();
      RestService.post(ADD_USER, client).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    addAdmin: function add(client) {
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
      RestService.delete("".concat(USERS, "/").concat(id)).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    getClientById: function getClientById(id) {
      var deferred = $q.defer();
      RestService.get("".concat(CLIENTS, "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('client', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    getUserAddresses: function getUserAddresses(id) {
      var deferred = $q.defer();
      RestService.get("".concat(ADDRESSES, "/").concat("user", "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('addresses', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);