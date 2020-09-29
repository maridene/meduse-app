'use strict';

angular.module('sbAdminApp')
  .service('AuthenticationService', ['$q', '$http', '$cookieStore', '$rootScope', 'ObjectBuilder', 'RestService', function($q, $http, $cookieStore, $rootScope, ObjectBuilder, RestService) {
    const USERS = 'users';
    const USER_AUTH = 'users/authenticate';
    return {
        authenticate(email, password) {
            const deferred = $q.defer();
            RestService.post(USER_AUTH, {email, password})
            .then(
                (result) => {
                    const user = ObjectBuilder.buildObject('user', result.data);
                    if (user && user.role === 'Admin') {
                        deferred.resolve(user);
                    } else {
                        deferred.reject({reason: 'not_authorized'});
                    }
                },
                (error) => deferred.reject(error)
            );
            return deferred.promise;
        },
        setCredentials(user) {
            $rootScope.globals = {
                currentUser: user
            };
    
            // set default auth header for http requests
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
    
            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            const cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 7);
            $cookieStore.put('globals', $rootScope.globals, { expires: cookieExp });
        },
    
        clearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Bearer';
        },
    
        isAuthenticated () {
            return $rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.token;
        }
    }
  }]);

