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

  currentUser() {
    return this.$rootScope.globals && this.$rootScope.globals.currentUser ? this.$rootScope.globals.currentUser.data : null; 
  }

  getRequestConfig(config) {
    if (typeof config === 'undefined') {
      const userId = this.currentUser() ? this.currentUser().id : null; 
      config = {headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Credentials': 'true',
        'userid': userId
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
    return this._$http.post(`${this.getBaseUrl() + url}`, data, this.getRequestConfig(config));
  }
  delete(url, data, config) {
    return this._$http.post(`${this.getBaseUrl() + url}`, data, this.getRequestConfig(config));
  }
  post(url, data, config) {
    return this._$http.post(`${this.getBaseUrl() + url}`, data, this.getRequestConfig(config));
  }
}
