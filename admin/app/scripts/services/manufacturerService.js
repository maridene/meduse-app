'use strict';

angular.module('sbAdminApp')
  .service('ManufacturerService', ['$q', 'ObjectBuilder', 'RestService', function($q, ObjectBuilder, RestService) {
    const MANUFACTURERS = 'manufacturers';
    return {
      getAll() {
        const deferred = $q.defer();
        RestService.get(MANUFACTURERS)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('manufacturers', result.data)),
                (error) => deferred.reject(error)
            );
        return deferred.promise;
      },
      getById(id) {
        const deferred = $q.defer();
        RestService.get(`${MANUFACTURERS}/${id}`)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('manufacturer', result.data)),
                (error) => deferred.reject(error));
        return deferred.promise;
      },
      add(manufacturer) {
        const deferred = $q.defer();
        RestService.post(MANUFACTURERS, manufacturer)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      },
      remove(id) {
        const deferred = $q.defer();
        RestService.delete(`${MANUFACTURERS}/${id}`)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      }
    }
  }]);

