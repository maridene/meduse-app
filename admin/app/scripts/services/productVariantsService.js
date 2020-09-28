'use strict';

angular.module('sbAdminApp')
.service('ProductVariantsService', ['$q', 'RestService', 'ObjectBuilder', function($q, RestService, ObjectBuilder) {
  const PRODUCTS_VARIANTS = 'productvariants';

  const addAll = (variants)  => {
    const deferred = $q.defer();
    const promises = variants.map((variant) => RestService.post(PRODUCTS_VARIANTS, variant));
    $q.all(promises)
        .then((result) => {
            deferred.resolve(result);
        }, (error) => {
            deferred.reject(error);
        });
    return deferred.promise;
  };

  const deleteVariant = (id) => {
    const deferred = $q.defer();
    RestService.delete(`${PRODUCTS_VARIANTS}/${id}`)
        .then((result) => {
            deferred.resolve(result);
        }, (error) => {
            deferred.reject(error);
        })
    return deferred.promise;
  };

  return {
    addAll,
    deleteVariant
  }
}]);
