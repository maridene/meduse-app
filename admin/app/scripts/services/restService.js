'use strict';

angular.module('sbAdminApp').service('RestService', ['$http', function ($http) {
  function getRequestConfig(config) {
    if (typeof config === 'undefined') {
      config = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Access-Control-Allow-Credentials': 'true'
        }
      };
    } else {
      config.withCredentials = true;
      config.dontCheckCredentials = false;
      config.headers = {
        'X-Requested-With': 'XMLHttpRequest'
      };

      if (!config.hasOwnProperty('enableAutoErrorHandling')) {
        config.enableAutoErrorHandling = true;
      }
    }

    return config;
  }

  var getBaseUrl = function getBaseUrl() {
    return SERVER_URL + '/api/';
  };

  return {
    getBaseUrl: getBaseUrl,
    get: function get(url, config) {
      return $http.get("".concat(getBaseUrl() + url), getRequestConfig(config));
    },
    put: function put(url, data, config) {
      return $http.put("".concat(getBaseUrl() + url), data, getRequestConfig(config));
    },
    delete: function _delete(url, data, config) {
      return $http.delete("".concat(getBaseUrl() + url), data, getRequestConfig(config));
    },
    post: function post(url, data, config) {
      return $http.post("".concat(getBaseUrl() + url), data, getRequestConfig(config));
    }
  };
}]);