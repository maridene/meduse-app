'use strict';

angular.module('sbAdminApp')
.service('RestService', ['$http', function($http) {

  function getRequestConfig(config) {
    if (typeof config === 'undefined') {
      config = {headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Credentials': 'true'
      }};
    } else {
      config.withCredentials = true;
      config.dontCheckCredentials = false;
      config.headers = {'X-Requested-With': 'XMLHttpRequest'};
      if (!config.hasOwnProperty('enableAutoErrorHandling')) {
        config.enableAutoErrorHandling = true;
      }
    }
    return config;
  }

  const getBaseUrl = () =>  {
    return 'http://localhost:3000/';
  };

  return {
    getBaseUrl,
    get(url, config) {
      return $http.get(`${getBaseUrl() + url}`, getRequestConfig(config));
    },
    put(url, data, config) {
      return $http.post(`${getBaseUrl() + url}`, data, getRequestConfig(config));
    },
    delete(url, data, config) {
      return $http.delete(`${getBaseUrl() + url}`, data, getRequestConfig(config));
    },
    post(url, data, config) {
      return $http.post(`${getBaseUrl() + url}`, data, getRequestConfig(config));
    }
  }
}]);
