export default class RestService {
  constructor($http, $rootScope, AppConstants) {
    'ngInject';

    this._$http = $http;
    this.$rootScope = $rootScope;
    this.AppConstants = AppConstants;
  }
  getBaseUrl() {
    return this.AppConstants.api + '/';
  }

  getRequestConfig(config) {
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

  get(url, config) {
    return this._$http.get(`${this.getBaseUrl() + url}`, this.getRequestConfig(config));
  }
  put(url, data, config) {
    return this._$http.put(`${this.getBaseUrl() + url}`, data, this.getRequestConfig(config));
  }
  delete(url, data, config) {
    return this._$http.delete(`${this.getBaseUrl() + url}`, data, this.getRequestConfig(config));
  }
  post(url, data, config) {
    return this._$http.post(`${this.getBaseUrl() + url}`, data, this.getRequestConfig(config));
  }
}
