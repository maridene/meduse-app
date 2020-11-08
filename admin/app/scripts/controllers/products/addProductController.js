'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddProductCtrl
 * @description
 * # MainCtrl
 * Controller of the add product page
 */

angular.module('sbAdminApp').controller('AddProductCtrl', ['$scope', '$q', 'uuid', 'Upload', 'ProductService', 'ProductVariantsService', 'CategoryService', 'ManufacturerService', 
function ($scope, $q, uuid, Upload, ProductService, ProductVariantsService, CategoryService, ManufacturerService) {
  $scope.categories = [];
  $scope.manufacturers = [];
  CategoryService.getAllCategories().then(function(categories) {
    $scope.categories =  categories;
    }, function (err) {
      $state.go('dashboard.home')
    });

  ManufacturerService.getAll().then(
    function(manufacturers) {
      $scope.manufacturers = manufacturers;
    }, function(err) {
      $state.go('dashboard.home')
    });
  
  $scope.form = {
    files: [],
    tags: [],
    withVariants: 'none',
    variants: []
  };
  $scope.$watch('form', function () {
    if (typeof $scope.form.selectedManufacturerId !== 'undefined' && typeof $scope.form.selectedCategoryId !== 'undefined' && $scope.form.label) {
      var selectedCategoryName = $scope.categories.filter(function (item) {
        return item.id == $scope.form.selectedCategoryId;
      })[0].label;
      var selectedManufName = $scope.manufacturers.filter(function (item) {
        return item.id == $scope.form.selectedManufacturerId;
      })[0].name;

      $scope.form.sku = getProductSKU(selectedCategoryName, selectedManufName, $scope.form.label);

      if ($scope.form.variants.length) {
        $scope.form.variants.forEach(function (item) {
          return $scope.variantPropertyChanged(item);
        });
      }
    }
  }, true);

  $scope.addVariant = function () {
    var id = uuid.v4();

    switch ($scope.form.withVariants) {
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

  $scope.withVariantsOnchange = function () {
    $scope.form.variants = [];
  };

  $scope.deleteItem = function (item) {
    $scope.form.variants = $scope.form.variants.filter(function (v) {
      return v.id !== item.id;
    });
  };

  $scope.variantPropertyChanged = function (item) {
    if (item.type === 'colors') {
      item.sku = "".concat($scope.form.sku, "-").concat(propertyAbbrev(item.color));
    } else if (item.type === 'sizes') {
      item.sku = "".concat($scope.form.sku, "-").concat(propertyAbbrev(item.size));
    } else {
      item.sku = "".concat($scope.form.sku, "-").concat(propertyAbbrev(item.color), "-").concat(propertyAbbrev(item.size));
    }
  };

  var propertyAbbrev = function propertyAbbrev(value) {
    if (value.length <= 3) {
      return value;
    } else {
      return value.substring(0, 3);
    }
  };

  $scope.submit = function () {
    var productQuantity = null;

    if ($scope.form.withVariants && $scope.form.variants.length) {
      productQuantity = $scope.form.variants.reduce(function (acc, cur) {
        return acc + cur.quantity;
      }, Number(0));
    }

    var product = {
      sku: $scope.form.sku,
      label: $scope.form.label,
      description: $scope.form.description,
      price: $scope.form.price,
      tva: $scope.form.tva,
      quantity: productQuantity !== null ? productQuantity : $scope.form.quantity,
      lowStockThreshold: $scope.form.lowStockThreshold,
      category_id: $scope.form.selectedCategoryId,
      long_description: $scope.form.presentation,
      promo_price: $scope.form.promo_price,
      manufacturerId: $scope.form.selectedManufacturerId,
      weight: $scope.form.weight,
      images: '',
      video_link: $scope.form.videolink,
      tags: $scope.form.tags.toString()
    };
   
    upload($scope.form.files).then(function (filenames) {
      if (filenames && filenames.length) {
        product.images = filenames.toString();
        ProductService.add(product).then(function (result) {
          if ($scope.form.variants.length) {
            ProductVariantsService.addAll(getProductVariantsArray(result.data.id)).then(function () {
              clear();
              showModal('#successModal');
            }, function () {
              showModal("#errorModal");
            });
          } else {
            clear();
            showModal('#successModal');
          }
        }, function () {
          showModal("#errorModal");
        });
      } else {
        ProductService.add(product).then(function (result) {
          if ($scope.form.variants.length) {
            ProductVariantsService.addAll(getProductVariantsArray(result.data.id)).then(function () {
              clear();
              showModal('#successModal');
            }, function () {
              showModal("#errorModal");
            });
          } else {
            clear();
            showModal('#successModal');
          }
        }, function () {
          showModal("#errorModal");
        });
      }
    }, function () {
      showModal("#errorModal");
    });
  }

  var upload = function upload(files) {
    var deferred = $q.defer();

    if (files && files.length) {
      Upload.upload({
        url: SERVER_URL+'/productupload',
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
  /*
  var uploadProductVariantsImages = function uploadProductVariantsImages() {
    if ($scope.form.variants.length && $scope.form.variants.some(function (item) {
      return item.imageFile;
    })) {
      //complete image name for variants with images
      $scope.form.variants = $scope.form.variants.map(function (variant) {
        if (variant.imageFile) {
          variant.image = variant.image + '.' + variant.imageFile.name.split('.').pop();
        } else {
          variant.image = null;
        }
        return variant;
      });

      var variantsWithImages = $scope.form.variants.filter(function (item) {
        return item.imageFile;
      });

      return variantsWithImages.map(function (variant, index) {
        var eachDeferred = $q.defer();
        var params = {url: 'http://localhost:3000/productvariantupload'};
        params[`varImg-${index}`] = variant.imageFile;
        Upload.upload(params)
          .then(function (resp) {
            //upload function returns a promise
            if (resp.data.error_code === 0) {
              //validate success
              //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
              eachDeferred.resolve();
            } else {
              eachDeferred.reject();
            }
          }, function (error) {
            //catch error
            eachDeferred.reject(error);
          });
        return eachDeferred.promise;
      });
     } else {
      return [];
    }
  };
  */

  var showModal = function showModal(id) {
    var dlgElem = angular.element(id);

    if (dlgElem) {
      dlgElem.modal("show");
    }
  };

  var clear = function clear() {
    $scope.form = {
      files: [],
      tags: [],
      withVariants: 'none',
      variants: []
    };
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

  $scope.addTag = function () {
    if (!isBlank($scope.tagItem) && $scope.form.tags.indexOf($scope.tagItem) === -1) {
      $scope.form.tags.push($scope.tagItem);
      $scope.tagItem = '';
    }
  };

  $scope.removeTag = function (tagToRemove) {
    $scope.form.tags = $scope.form.tags.filter(function(item) {
      return item !== tagToRemove;
    });
  };

}]);