'use strict';

angular.module('sbAdminApp').service('BlogService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var BLOGS = 'blogs';
  return {
    getAll: function getAll() {
      var deferred = $q.defer();
      RestService.get(BLOGS).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('blogs', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    getById: function getId(id) {
      var deferred = $q.defer();
      RestService.get("".concat(BLOGS, "/").concat(id)).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('blog', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    add: function add(blog) {
      var deferred = $q.defer();
      RestService.post(BLOGS, blog).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    update: function update(id, blog) {
      var deferred = $q.defer();
      RestService.put("".concat(BLOGS, "/").concat(id), blog).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    },
    remove: function remove(id) {
      var deferred = $q.defer();
      RestService.delete("".concat(BLOGS, "/").concat(id)).then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);