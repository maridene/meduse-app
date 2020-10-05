'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:EditProductCtrl
 * @description
 * # MainCtrl
 * Controller of the edit product product page
 */

angular.module('sbAdminApp').controller('EditProductCtrl', ['$scope', '$q', 'uuid', 'ProductService', 'ProductVariantsService', 'Upload', 'data', 'categories', 'manufacturers', 
function ($scope, $q, uuid, ProductService, ProductVariantsService, Upload, data, categories, manufacturers) {
  console.log(categories);
  console.log(manufacturers);
  console.log(data);
  
  //set variants
  $scope.withVariants = null;
  if (data.variants.length === 0 ) {
    $scope.withVariants = 'none';
  } else if (data.variants.filter(function(item) {return !isBlank(item.color) && !isBlank(item.size)}).length > 0) {
    $scope.withVariants = 'colors-sizes';
  } else if (data.variants.filter(function(item) {return !isBlank(item.color)}).length > 0) {
    $scope.withVariants = 'colors';
  } else {
    $scope.withVariants = 'sizes';
  }

  $scope.categories = categories;
  $scope.manufacturers = manufacturers;
  $scope.form = {
    files: [],
    product: {
      selectedCategoryId: data.product.category_id,
      selectedManufacturerId : data.product.manufacturerId,
      label: data.product.label,
      sku: data.product.sku,
      description: data.product.description,
      price: data.product.price,
      tva: data.product.tva,
      promo_price: data.product.promo_price,
      quantity: data.product.quantity,
      lowStockThreshold: data.product.lowStockThreshold,
      weight: data.product.weight,
      long_description: data.product.long_description,
      video_link: data.product.video_link,
      tags: data.product.tags && data.product.tags.length ? data.product.tags.split(',') : [],
      images: data.product.images,
      imagesThumbs: data.product.images && data.product.images.length ? 
        data.product.images.split(',').map(function(image) {return `${SERVER_URL}/static/products/${image}`}) : []
    },
    variants: data.variants.map(function(item) {
      item.type = $scope.withVariants;
      return item;
    })
  };

  $scope.$watch('form', function () {
    var selectedCategoryName = $scope.categories.filter(function (item) {
      return item.id == $scope.form.product.selectedCategoryId;
    })[0].label;
    var selectedManufName = $scope.manufacturers.filter(function (item) {
      return item.id == $scope.form.product.selectedManufacturerId;
    })[0].name;
    $scope.form.product.sku = $scope.form.sku = getProductSKU(selectedCategoryName, selectedManufName, $scope.form.product.label);

    if ($scope.form.variants.length) {
      $scope.form.variants.forEach(function (item) {
        return $scope.variantPropertyChanged(item);
      });
    }
    
  }, true);

  $scope.addTag = function () {
    if (!isBlank($scope.tagItem) && $scope.form.product.tags.indexOf($scope.tagItem) === -1) {
      $scope.form.product.tags.push($scope.tagItem);
      $scope.tagItem = '';
    }
  };

  $scope.removeTag = function (tagToRemove) {
    $scope.form.product.tags = $scope.form.product.tags.filter(function(item) {
      return item !== tagToRemove;
    });
  };

  $scope.withVariantsOnchange = function () {
    $scope.form.variants = [];
  };

  $scope.addVariant = function () {
    var id = uuid.v4();

    switch ($scope.withVariants) {
      case 'colors':
        $scope.form.variants.push({
          id: id,
          type: 'colors',
          color: '',
          quantity: 0,
          sku: $scope.form.sku
        });
        break;

      case 'sizes':
        $scope.form.variants.push({
          id: id,
          type: 'sizes',
          size: '',
          quantity: 0,
          sku: $scope.form.sku
        });
        break;

      case 'colors-sizes':
        $scope.form.variants.push({
          id: id,
          type: 'colors-sizes',
          size: '',
          color: '',
          quantity: 0,
          sku: $scope.form.sku
        });
        break;

      default:
        break;
    }
  };


  $scope.deleteItem = function (item) {
    $scope.form.variants = $scope.form.variants.filter(function (v) {
      return v.id !== item.id;
    });
  };

  $scope.resetImages = function () {
    $scope.form.product.images = '';
    $scope.form.product.imagesThumbs = [];
  };

  $scope.variantPropertyChanged = function (item) {
    if (item.type === 'colors') {
      item.sku = "".concat($scope.form.product.sku, "-").concat(propertyAbbrev(item.color));
    } else if (item.type === 'sizes') {
      item.sku = "".concat($scope.form.product.sku, "-").concat(propertyAbbrev(item.size));
    } else {
      item.sku = "".concat($scope.form.product.sku, "-").concat(propertyAbbrev(item.color), "-").concat(propertyAbbrev(item.size));
    }
  };

  var propertyAbbrev = function propertyAbbrev(value) {
    if (value.length <= 3) {
      return value;
    } else {
      return value.substring(0, 3);
    }
  };

  var showModal = function showModal(id) {
    var dlgElem = angular.element(id);

    if (dlgElem) {
      dlgElem.modal("show");
    }
  };

  var getProductVariantsArray = function getProductVariantsArray(productId) {
    return $scope.form.variants.map(function (variant) {
      return {
        sku: variant.sku,
        product_id: productId,
        color: variant.color,
        size: variant.size,
        quantity: variant.quantity,
        image: null
      };
    });
  };


  $scope.submit = function () {
    var productQuantity = null;

    if ($scope.withVariants && $scope.form.variants.length) {
      productQuantity = $scope.form.variants.reduce(function (acc, cur) {
        return acc + cur.quantity;
      }, Number(0));
    }

    var product = {
      sku: $scope.form.product.sku,
      label: $scope.form.product.label,
      description: $scope.form.product.description,
      price: $scope.form.product.price,
      tva: $scope.form.product.tva,
      quantity: productQuantity !== null ? productQuantity : $scope.form.product.quantity,
      lowStockThreshold: $scope.form.product.lowStockThreshold,
      category_id: $scope.form.product.selectedCategoryId,
      long_description: $scope.form.product.long_description,
      promo_price: $scope.form.product.promo_price,
      manufacturerId: $scope.form.product.selectedManufacturerId,
      weight: $scope.form.product.weight,
      images: $scope.form.product.images,
      video_link: $scope.form.product.video_link,
      tags: $scope.form.product.tags.toString()
    };

    var uploadPromise = null;
    if ($scope.form.files && $scope.form.files.length) {
      uploadPromise = upload($scope.form.files);
    } else {
      uploadPromise = $q.when();
    }
   
    uploadPromise.then(function (filenames) {
      if (filenames && filenames.length) {
        product.images = filenames.toString();
      }
      ProductService.update(data.product.id, product).then(function (result) {
        updateVariants(result.data.id)
          .then(function() {
            showModal("#successModal");
          }, function (error) {
            showModal("#errorModal");
          })
      }, function () {
        showModal("#errorModal");
      });
    }, function () {
      showModal("#errorModal");
    });
  }

  var upload = function upload(files) {
    var deferred = $q.defer();

    if (files && files.length) {
      Upload.upload({
        url: `${SERVER_URL}/productupload`,
        data: {
          productImages: files
        }
      }).then(function (resp) {
        if (resp.data.error_code === 0) {
          deferred.resolve(resp.data.files.map(function (item) {
            return item.filename;
          }));
        } else {
          deferred.reject();
        }
      }, function (error) {
        deferred.reject(error);
      }, function (evt) {
        console.log(evt);
      });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  };

  var updateVariants = function (productId) {
    var deferred = $q.defer();
    var toDeleteVariantsIds = [];
    var toAddVariants = getProductVariantsArray(productId);
    //no more variants
    if (variantsChanged) {
      toDeleteVariantsIds = data.variants.map(function(item) {
        return item.id;
      });
      if (toDeleteVariantsIds.length) {
        ProductVariantsService.deleteVariants(toDeleteVariantsIds)
          .then(() => {
            if (toAddVariants.length) {
              ProductVariantsService.addAll(toAddVariants)
                .then(function () {
                  deferred.resolve();
                }, function(error) {
                  deferred.reject(error);
                })
            } else {
              deferred.resolve();
            }
          }, function(error) {
            deferred.reject(error);
          })
      } else {
        if (toAddVariants.length) {
          ProductVariantsService.addAll(toAddVariants)
            .then(function () {
              deferred.resolve();
            }, function(error) {
              deferred.reject(error);
            })
        } else {
          deferred.resolve();
        }
      }
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  };

  var variantsChanged = function() {
    var changed = false;
    if (data.variants.length !== $scope.form.variants.length) {
      return true;
    } else {
      data.variants.forEach(function(original){
        var exist = $scope.form.variants.filter(function(newVar) {
          return original.color === newVar.color && original.size === newVar.size && original.quantity === newVar.quantity;
        }).length;
        if (exist === 0) {
          changed = true
        }
      });
      return changed;
    }
  };

}]);