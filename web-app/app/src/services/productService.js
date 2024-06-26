import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';
import { getImagesUrlsFromProduct } from '../utils';

export default class ProductService {
  constructor(RestService, $q, ObjectBuilder) {
    'ngInject';

    this._RestService = RestService;
    this._$q = $q;
    this.ObjectBuilder = ObjectBuilder;
  }

  getProductById(id) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}/${id}`)
        .then(
            (result) => {
              deferred.resolve({
                product: this.ObjectBuilder.buildObject(RESOURCE.PRODUCT, result.data.product),
                variants: this.ObjectBuilder.buildObject(RESOURCE.PRODUCT_VARIANTS, result.data.variants)
              })
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  getProductsByCategory(categoryId, startAt, maxResult, orderBy) {
    const deferred = this._$q.defer();
    const url = ApiConstants.PRODUCTS_BY_CATEGORY_ID.replace('{0}', categoryId).replace('{1}', startAt).replace('{2}', maxResult).replace('{3}', orderBy);
    this._RestService.get(url)
      .then(
          (result) => deferred.resolve(
            {
              count: result.data.count, 
              items: this.ObjectBuilder.buildObject(RESOURCE.PRODUCT_ITEMS, result.data.items),
              manufacturers: result.data.manufacturers
            }),
          (error) => deferred.reject(error)
      );
    return deferred.promise;
  }

  getProductVariants(productId) {
    const deferred = this._$q.defer();
    const url = ApiConstants.PRODUCT_VARAINTS.replace('{0}', productId);
    this._RestService.get(url)
      .then(
          (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCT_VARIANTS, result.data)),
          (error) => deferred.reject(error)
      );
    return deferred.promise;
  }

  getLastNProduct(n) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}/last/${n}`)
        .then(
            (result) => {
              deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCTS, result.data))
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  getPinnedProducts() {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}/pin/pinned`)
        .then(
            (result) => {
              deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCTS, result.data))
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  getPromoProducts() {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}/promo/all`)
        .then(
            (result) => {
              deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCTS, result.data))
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  getNewProducts() {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}/new/isnew`)
        .then(
            (result) => {
              deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCTS, result.data))
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  getRelatedProducts(id) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}/related/${id}`)
        .then(
            (result) => {
              deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCTS, result.data))
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  search(query) {
    const deferred = this._$q.defer();
    this._RestService.get(`${ApiConstants.PRODUCTS}/all/search?query=${query}`)
        .then(
            (result) => {
              deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.PRODUCTS, result.data))
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  }

  getImagesUrls(product, variants) {
    if (product.imgCount || variants) {
      return [...this.getProductImagesUrls(product), ...this.getVariantsImagesUrls(variants)];
    } else {
      return [];
    }
  }

  getProductImagesUrls(product) {
    return getImagesUrlsFromProduct(this._RestService.getBaseUrl(), product);
  }

  getVariantsImagesUrls(variants) {
    return variants.reduce((acc, cur) => [...acc, ...getImagesUrlsFromProduct(this._RestService.getBaseUrl(), cur)], []);
  }
}
