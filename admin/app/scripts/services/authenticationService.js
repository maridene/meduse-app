'use strict';

angular.module('sbAdminApp').service('AuthenticationService', ['$q', '$http', '$cookieStore', '$rootScope', 'ObjectBuilder', 'RestService', function ($q, $http, $cookieStore, $rootScope, ObjectBuilder, RestService) {
  var USERS = 'users';
  var USER_AUTH = 'users/authenticate';
  return {
    authenticate: function authenticate(email, password) {
      var deferred = $q.defer();
      RestService.post(USER_AUTH, {
        email: email,
        password: password
      }).then(function (result) {
        var user = ObjectBuilder.buildObject('user', result.data);

        if (user && user.role === 'Admin') {
          deferred.resolve(user);
        } else {
          deferred.reject({
            reason: 'not_authorized'
          });
        }
      }, function (error) {
        return deferred.reject(error);
      });
      return deferred.promise;
    },
    setCredentials: function setCredentials(user) {
      $rootScope.adminGlobals = {
        currentUser: user
      }; // set default auth header for http requests

      $http.defaults.headers.common['Authorization'] = 'Bearer ' + user.token; // store user details in adminGlobals cookie that keeps user logged in for 1 week (or until they logout)

      var cookieExp = new Date();
      cookieExp.setDate(cookieExp.getDate() + 7);
      $cookieStore.put('adminGlobals', $rootScope.adminGlobals, {
        expires: cookieExp
      });
    },
    clearCredentials: function clearCredentials() {
      $rootScope.adminGlobals = {};
      $cookieStore.remove('adminGlobals');
      $http.defaults.headers.common.Authorization = 'Bearer';
    },
    isAuthenticated: function isAuthenticated() {
      return $rootScope.adminGlobals && $rootScope.adminGlobals.currentUser && $rootScope.adminGlobals.currentUser.token;
    }
  };
}]);