'use strict';

angular.module('sbAdminApp').service('CategoryService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var CATEGORIES = 'categories';
  return {
    getAllCategories: function getAllCategories() {
      var deferred = $q.defer();
      RestService.get(CATEGORIES).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('categories', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    getCategoryById: function getCategoryById(id) {
      var deferred = $q.defer();
      RestService.get("".concat(CATEGORIES, "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('category', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    addCategory: function addCategory(category) {
      var deferred = $q.defer();
      RestService.post(CATEGORIES, category).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    removeCategory: function removeCategory(id) {
      var deferred = $q.defer();
      RestService.delete("".concat(CATEGORIES, "/").concat(id)).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    update: function update(id, category) {
      var deferred = $q.defer();
      RestService.put("".concat(CATEGORIES, "/").concat(id), category).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    updateOrders: function updateOrders(data) {
      var deferred = $q.defer();
      RestService.post("".concat(CATEGORIES, "/updateorders"), data).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);