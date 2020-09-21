'use strict';

angular.module('sbAdminApp')
  .service('BlogService', ['$q', 'ObjectBuilder', 'RestService', function($q, ObjectBuilder, RestService) {
    const BLOGS = 'blogs';
    return {
      getAll() {
        const deferred = $q.defer();
        RestService.get(BLOGS)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('blogs', result.data)),
                (error) => deferred.reject(error)
            );
        return deferred.promise;
      },
      getId(id) {
        const deferred = $q.defer();
        RestService.get(`${BLOGS}/${id}`)
            .then(
                (result) => deferred.resolve(ObjectBuilder.buildObject('blog', result.data)),
                (error) => deferred.reject(error));
        return deferred.promise;
      },
      add(blog) {
        const deferred = $q.defer();
        RestService.post(BLOGS, blog)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      },
      remove(id) {
        const deferred = $q.defer();
        RestService.delete(`${BLOGS}/${id}`)
            .then((result) => {
              deferred.resolve(result);
            }, (error) => {
              deferred.reject(error);
            });
        return deferred.promise;
      }
    }
  }]);

