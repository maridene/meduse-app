'use strict';

const CATEGORIES_URL = 'categories';

angular.module('meduseApp.core.category', ['meduseApp.core.restService', 'meduseApp.core.objectbuilder'])

    .factory('CategoryService', (RestService, $q, ObjectBuilder) => ({
      getAllCategories() {
        const deferred = $q.defer();
        RestService.get(CATEGORIES_URL)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject(RESOURCE.CATEGORIES, result.data)),
                (error) => deferred.reject(error)
            );
        return deferred.promise;
      },
      getCategoryById(id) {
        const deferred = $q.defer();
        RestService.get(`${CATEGORIES_URL}`/`${id}`)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject(RESOURCE.CATEGORY, result.data)),
                (error) => deferred.reject(error));
        return deferred.promise;
      },
      addCategory(category) {
        RestService.post(CATEGORIES_URL, category)
            .then((result) => {

            }, (error) => {

            });
      }
    }))
    .factory('CategoryObjectsBuilder', () => {

    });