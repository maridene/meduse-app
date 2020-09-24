'use strict';

angular.module('sbAdminApp')
.service('ProductService', ['$q', 'RestService', 'ObjectBuilder', function($q, RestService, ObjectBuilder) {
  const PRODUCTS = 'products';
  const PRODUCTS_BY_CATEGORY_ID = 'products/category/{0}?startat={1}&maxresult={2}&orderBy={3}';

  const getProductById = (id) => {
    const deferred = $q.defer();
    RestService.get(`${PRODUCTS}/${id}`)
        .then(
            (result) => {
              deferred.resolve({
                product: ObjectBuilder.buildObject('product', result.data.product),
                variants: ObjectBuilder.buildObject('product_variants', result.data.variants),
                imagesUrl: getImagesUrls(result.data.product, result.data.variants)
              })
            },
            (error) => deferred.reject(error));
    return deferred.promise;
  };

  const getProductsByCategory = (categoryId, startAt, maxResult, orderBy) => {
    const deferred = $q.defer();
    const url = PRODUCTS_BY_CATEGORY_ID.replace('{0}', categoryId).replace('{1}', startAt).replace('{2}', maxResult).replace('{3}', orderBy);
    RestService.get(url)
      .then(
          (result) => deferred.resolve({count: result.data.count, items: ObjectBuilder.buildObject('product_items', result.data.items)}),
          (error) => deferred.reject(error)
      );
    return deferred.promise;
  };

  const add = (product)  => {
    const deferred = $q.defer();
    RestService.post(PRODUCTS, product)
        .then((result) => {
          deferred.resolve(result);
        }, (error) => {
          deferred.reject(error);
        });
    return deferred.promise;
  }

  function getImagesUrls(product, variants) {
    if (product.imgCount || variants) {
      return [...getProductImagesUrls(product), ...getVariantsImagesUrls(variants)];
    } else {
      return [];
    }
  };

  function getProductImagesUrls(product) {
    return getImagesUrlsFromProduct(RestService.getBaseUrl(), product);
  };

  function getVariantsImagesUrls(variants) {
    return variants.reduce((acc, cur) => [...acc, ...getImagesUrlsFromProduct(RestService.getBaseUrl(), cur)], []);
  };

  function getImagesUrlsFromProduct(baseUrl, product) {
    if (product.imgCount) {
        return Array(product.imgCount).fill(`${baseUrl}images/${product.sku}`).map((item, index) => `${item}-${index+1}.jpg`);
    } else {
        return [`${baseUrl}images/no-image.jpg`];
    }
}

  return {
    getProductById,
    getProductsByCategory,
    add
  }
}]);
