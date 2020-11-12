import { ApiConstants } from '../config/app.constants';

export default class ManufacturersService {
  constructor(RestService, $q, $rootScope) {
    'ngInject';

    this._RestService = RestService;
    this._$q = $q;
    this.$rootScope = $rootScope;
  }

  getAll() {
    const deferred = this._$q.defer();
    this._RestService.get(ApiConstants.MANUFACTURERS)
        .then(
            (result) => deferred.resolve(result.data),
            (error) => deferred.reject(error)
        );
    return deferred.promise;
  }
}
