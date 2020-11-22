'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:EditProductCtrl
 * @description
 * # MainCtrl
 * Controller of the edit product product page
 */

angular.module('sbAdminApp')
  .controller('EditProductCtrl', ['$scope', '$q', '$stateParams', 'uuid', 'ProductService', 'CategoryService', 'ManufacturerService', 'ProductVariantsService', 'Upload', 
  function ($scope, $q, $stateParams, uuid, ProductService, CategoryService, ManufacturerService, ProductVariantsService, Upload) {
    var productId = $stateParams.productId;

    //init
    ProductService.getProductById(productId).then(function(data) {
      $scope.variants = data.variants;
      $scope.product = data.product;
      $scope.originalVariants = angular.copy($scope.variants);
      //set variants
      $scope.withVariants = null;
      if ($scope.variants.length === 0 ) {
        $scope.withVariants = 'none';
      } else if ($scope.variants.filter(function(item) {return !isBlank(item.color) && !isBlank(item.size)}).length > 0) {
        $scope.withVariants = 'colors-sizes';
      } else if ($scope.variants.filter(function(item) {return !isBlank(item.color)}).length > 0) {
        $scope.withVariants = 'colors';
      } else {
        $scope.withVariants = 'sizes';
      }
      $scope.originalWithVariants = $scope.withVariants; 

      //prepare form
      $scope.form = {
        files: [],
        product: {
          selectedCategoryId: $scope.product.category_id,
          selectedManufacturerId : $scope.product.manufacturerId,
          label: $scope.product.label,
          sku: $scope.product.sku,
          description: $scope.product.description,
          price: $scope.product.price,
          tva: $scope.product.tva,
          promo_price: $scope.product.promo_price,
          quantity: $scope.product.quantity,
          lowStockThreshold: $scope.product.lowStockThreshold,
          weight: $scope.product.weight,
          long_description: $scope.product.long_description,
          video_link: $scope.product.video_link,
          tags: $scope.product.tags && $scope.product.tags.length ? $scope.product.tags.split(',') : [],
          images: $scope.product.images,
          imagesThumbs: $scope.product.images && $scope.product.images.length ? 
            $scope.product.images.split(',').map(function(image) { 
              return {
                filename: image,
                url: SERVER_URL+'/static/products/' +image,
                id: uuid.v4()
              }
            }) : []
        }
        ,
        variants: $scope.variants.map(function(item) {
          item.type = $scope.withVariants;
          return item;
        })
      };

      $scope.form.imagesList = $scope.form.product.imagesThumbs;

      //prepare categories list
      CategoryService.getAllCategories().then(function(categories) {
        $scope.categories = categories;
        //prepare manufacturers list
        ManufacturerService.getAll().then(
          function(manufacturers) {
            $scope.manufacturers = manufacturers;
            $scope.$watch('form', updateSKUs, true);
        });
      });
    });

    var updateSKUs = function () {
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
    };

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
      if ($scope.withVariants === $scope.originalWithVariants) {
        $scope.form.variants = $scope.variants.map(function(item) {
          item.type = $scope.withVariants;
          return item;
        });
      } else {
        $scope.form.variants = [];
      }
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
        images: $scope.form.imagesList.map(function(each) {
          return each.filename;
        }).join(','),
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
          product.images = product.images.length ?  product.images + ',' + filenames.toString() : filenames.toString();
        }
        ProductService.update($stateParams.productId, product).then(function (result) {
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
          url: SERVER_URL + '/productupload',
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

    var updateVariants = function () {
      var deferred = $q.defer();
      var toDeleteVariantsIds = getToDeleteVariantsIds();
      var toUpdateVariants = getToUpdateVariants();
      var toAddVariants = getToAddVariants();
      
      var promises = [];

      if (toDeleteVariantsIds.length) {
        promises.push(ProductVariantsService.deleteVariants(toDeleteVariantsIds));
      }
      if (toUpdateVariants.length) {
        toUpdateVariants.forEach(function(each) {
          promises.push(ProductVariantsService.updateById(each.id, each.variant));
        });
      }
      if (toAddVariants.length) {
        promises.push(ProductVariantsService.addAll(toAddVariants));
      }

      $q.all(promises).then(function() {
        deferred.resolve();
      }, function(error) {
        console.log(error);
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var variantsChanged = function() {
      var changed = false;
      if ($scope.variants.length !== $scope.form.variants.length) {
        return true;
      } else {
        $scope.variants.forEach(function(original){
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

    $scope.deleteThumb = function (thumb) {
      $scope.form.imagesList = $scope.form.imagesList.filter(function (each) {
        return each.id !== thumb.id;
      });
    };

    $scope.dragEnd = function() {
      console.log($scope.form.imagesList);
    };

    var getToDeleteVariantsIds = function() {
      var toDelete = [];
      $scope.originalVariants.forEach(function (old) {
        var found = $scope.form.variants.filter(function(eachNew) {
          return eachNew.id === old.id;
        });
        if (found.length === 0) {
          toDelete.push(old.id);
        }
      });
      return toDelete;
    };

    var getToAddVariants = function() {
      var toAdd = [];
      $scope.form.variants.forEach(function (eachNew) {
        var found = $scope.originalVariants.filter(function(eachOld) {
          return eachNew.id === eachOld.id;
        });
        if (!found.length) {
          toAdd.push({
            sku: eachNew.sku,
            product_id: productId,
            color: eachNew.color,
            size: eachNew.size,
            quantity: eachNew.quantity
          });
        }
      });
      return toAdd;
    };

    var getToUpdateVariants = function() {
      var toUpdate = [];
      $scope.originalVariants.forEach(function(old) {
        var found = $scope.form.variants.filter(function(eachNew) {
          return eachNew.id === old.id;
        });
        if (found.length && 
          (found[0].size !== old.size || found[0].color !== old.color || found[0].quantity !== old.quantity)) {
            toUpdate.push({
              id: old.id, 
              variant: {
                color: found[0].color,
                size: found[0].size,
                quantity: found[0].quantity,
                sku: found[0].sku
              }
            });
        } 
      });
      return toUpdate;
    };

  }
]);