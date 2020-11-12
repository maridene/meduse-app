'use strict';

angular.module('sbAdminApp').service('CouponsService', ['$q', 'RestService', function ($q, RestService) {
  var COUPONS = 'coupons';
  return {
    getById: function getById(id) {
      var deferred = $q.defer();
      RestService.get("" + COUPONS + "/" + id).then(function (result) {
        return deferred.resolve(result.data);
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    }
  };
}]);