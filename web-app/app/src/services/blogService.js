import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class BlogService {
  constructor(RestService, $q, ObjectBuilder) {
    'ngInject';

    this._RestService = RestService;
    this._$q = $q;
    this.ObjectBuilder = ObjectBuilder;
  }

  getAll() {
    const deferred = this._$q.defer();
    this._RestService.get(ApiConstants.BLOGS)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.BLOG_ITEMS, result.data)),
            (error) => deferred.reject(error)
        );
    return deferred.promise;
  }
  getById(id) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.BLOGS}`/`${id}`)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.BLOG_ITEM, result.data)),
            (error) => deferred.reject(error));
    return deferred.promise;
  }
}
