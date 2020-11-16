'use strict';

angular.module('sbAdminApp').service('SettingsService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
  var SETTINGS = 'settings';
  return {
    getAll: function getAll() {
      var deferred = $q.defer();
      RestService.get(SETTINS).then(function (result) {
        return deferred.resolve(ObjectBuilder.buildObject('blogs', result.data));
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);