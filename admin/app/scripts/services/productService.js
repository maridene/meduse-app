'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

angular.module('sbAdminApp').service('ProductService', ['$q', 'RestService', 'ObjectBuilder', function ($q, RestService, ObjectBuilder) {
  var PRODUCTS = 'products';
  var PRODUCTS_BY_CATEGORY_ID = 'products/category/{0}?startat={1}&maxresult={2}&orderBy={3}';

  var getProductById = function getProductById(id) {
    var deferred = $q.defer();
    RestService.get("".concat(PRODUCTS, "/").concat(id)).then(function (result) {
      deferred.resolve({
        product: ObjectBuilder.buildObject('product', result.data.product),
        variants: ObjectBuilder.buildObject('product_variants', result.data.variants)
      });
    }, function (error) {
      return deferred.reject(error);
    });
    return deferred.promise;
  };

  var getAll = function getAll(id) {
    var deferred = $q.defer();
    RestService.get("".concat(PRODUCTS, "/")).then(function (result) {
      deferred.resolve(ObjectBuilder.buildObject('products', result.data));
    }, function (error) {
      return deferred.reject(error);
    });
    return deferred.promise;
  };

  var getProductsByCategory = function getProductsByCategory(categoryId, startAt, maxResult, orderBy) {
    var deferred = $q.defer();
    var url = PRODUCTS_BY_CATEGORY_ID.replace('{0}', categoryId).replace('{1}', startAt).replace('{2}', maxResult).replace('{3}', orderBy);
    RestService.get(url).then(function (result) {
      return deferred.resolve({
        count: result.data.count,
        items: ObjectBuilder.buildObject('products', result.data.items)
      });
    }, function (error) {
      return deferred.reject(error);
    });
    return deferred.promise;
  };

  var add = function add(product) {
    var deferred = $q.defer();
    RestService.post(PRODUCTS, product).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  var remove = function remove(id) {
    var deferred = $q.defer();
    RestService.delete("".concat(PRODUCTS, "/").concat(id)).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };
   
  var update = function update(id, product) {
    var deferred = $q.defer();
    RestService.put("".concat(PRODUCTS, "/").concat(id), product).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  var pin = function pin(id, state) {
    var deferred = $q.defer();
    RestService.post("".concat(PRODUCTS, "/pin/").concat(id), {state: state}).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  var updateIsNew = function pin(id, value) {
    var deferred = $q.defer();
    RestService.post("".concat(PRODUCTS, "/new/").concat(id), {value: value}).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  var updateIsExclusif = function pin(id, value) {
    var deferred = $q.defer();
    RestService.post("".concat(PRODUCTS, "/exclusif/").concat(id), {value: value}).then(function (result) {
      deferred.resolve(result);
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise;
  };

  function getImagesUrls(product, variants) {
    if (product.imgCount || variants) {
      return [].concat(_toConsumableArray(getProductImagesUrls(product)), _toConsumableArray(getVariantsImagesUrls(variants)));
    } else {
      return [];
    }
  };

  function getProductImagesUrls(product) {
    return getImagesUrlsFromProduct(RestService.getBaseUrl(), product);
  };

  function getVariantsImagesUrls(variants) {
    return variants.reduce(function (acc, cur) {
      return [].concat(_toConsumableArray(acc), _toConsumableArray(getImagesUrlsFromProduct(RestService.getBaseUrl(), cur)));
    }, []);
  };

  function getImagesUrlsFromProduct(baseUrl, product) {
    if (product.imgCount) {
      return Array(product.imgCount).fill("".concat(baseUrl, "images/").concat(product.sku)).map(function (item, index) {
        return "".concat(item, "-").concat(index + 1, ".jpg");
      });
    } else {
      return ["".concat(baseUrl, "images/no-image.jpg")];
    }
  }

  return {
    getProductById: getProductById,
    getProductsByCategory: getProductsByCategory,
    add: add,
    remove: remove,
    update: update,
    getAll: getAll,
    pin: pin,
    updateIsExclusif: updateIsExclusif,
    updateIsNew: updateIsNew
  };
}]);