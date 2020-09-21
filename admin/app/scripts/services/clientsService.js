'use strict';

angular.module('sbAdminApp')
  .service('ClientsService', ['$q', 'ObjectBuilder', 'RestService', function($q, ObjectBuilder, RestService) {
    const CLIENTS = 'clients';
    return {
      getAll() {
        const deferred = $q.defer();
        RestService.get(CLIENTS)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('clients', result.data)),
                (error) => deferred.reject(error)
            );
        return deferred.promise;
      },
      getId(id) {
        const deferred = $q.defer();
        RestService.get(`${CLIENTS}/${id}`)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('client', result.data)),
                (error) => deferred.reject(error));
        return deferred.promise;
      },
      add(client) {
        const deferred = $q.defer();
        RestService.post(CLIENTS, client)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      },
      remove(id) {
        const deferred = $q.defer();
        RestService.delete(`${CLIENTS}/${id}`)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      }
    }
  }]);

