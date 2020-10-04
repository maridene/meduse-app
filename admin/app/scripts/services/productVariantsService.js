'use strict';

angular.module('sbAdminApp').service('ProductVariantsService', ['$q', 'RestService', 'ObjectBuilder', function ($q, RestService, ObjectBuilder) {
  var PRODUCTS_VARIANTS = 'productvariants';

  var addAll = function addAll(variants) {
    var deferred = $q.defer();
    var promises = variants.map(function (variant) {
      return RestService.post(PRODUCTS_VARIANTS, variant);
    });
    $q.all(promises).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  var deleteVariant = function deleteVariant(id) {
    var deferred = $q.defer();
    RestService.delete("".concat(PRODUCTS_VARIANTS, "/").concat(id)).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  var deleteVariants = function deleteVariants(ids) {
    var deferred = $q.defer();
    if (ids.length === 0 ) {
      deferred.resolve();
    } else if (ids.length === 1){
      return deleteVariant(ids[0]);
    } else {
      $q.all(ids.map(function(id){
        return deleteVariant(id);
      }))
      .then(function(result) {
        deferred.resolve(result);
      }, function(error) {
        deferred.reject(error);
      });
    }
    return deferred.promise;
  };

  return {
    addAll: addAll,
    deleteVariant: deleteVariant,
    deleteVariants: deleteVariants
  };
}]);