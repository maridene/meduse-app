'use strict';

angular.module('sbAdminApp')
  .service('CategoryService', ['$q', 'ObjectBuilder', 'RestService', function($q, ObjectBuilder, RestService) {
    const CATEGORIES = 'categories';
    return {
      getAllCategories() {
        const deferred = $q.defer();
        RestService.get(CATEGORIES)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('categories', result.data)),
                (error) => deferred.reject(error)
            );
        return deferred.promise;
      },
      getCategoryById(id) {
        const deferred = $q.defer();
        RestService.get(`${CATEGORIES}/${id}`)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('category', result.data)),
                (error) => deferred.reject(error));
        return deferred.promise;
      },
      addCategory(category) {
        const deferred = $q.defer();
        RestService.post(CATEGORIES, category)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      },
      removeCategory(id) {
        const deferred = $q.defer();
        RestService.delete(`${CATEGORIES}/${id}`)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      }
    }
  }]);

