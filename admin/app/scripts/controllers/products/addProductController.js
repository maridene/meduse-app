'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddProductCtrl
 * @description
 * # MainCtrl
 * Controller of the add product page
 */
angular.module('sbAdminApp')
  .controller('AddProductCtrl', ['categories', 'manufacturers', '$scope', '$q', 'uuid', 'Upload', 'ProductService', 'ProductVariantsService', 
  function (categories, manufacturers, $scope, $q, uuid, Upload, ProductService, ProductVariantsService) {
    
    $scope.categories = categories;
    $scope.manufacturers = manufacturers;
    $scope.form = { 
      files: [],
      withVariants: 'none',
      variants: []
    };

    $scope.$watch('form', () => {
      if (typeof $scope.form.selectedManufacturerId !== 'undefined' 
      && typeof $scope.form.selectedCategoryId !== 'undefined'
      && $scope.form.label) {
        const selectedCategoryName = $scope.categories.filter((item) => item.id == $scope.form.selectedCategoryId)[0].label;
        const selectedManufName = $scope.manufacturers.filter((item) => item.id == $scope.form.selectedManufacturerId)[0].name;

        $scope.form.sku = `${selectedCategoryName}-${selectedManufName}-${skuFromProductLabel($scope.form.label)}`;
        if ($scope.form.variants.length) {
          $scope.form.variants.forEach((item) => $scope.variantPropertyChanged(item));
        }
      }
    }, true);

    $scope.addVariant = () => {
      const id = uuid.v4();
      switch($scope.form.withVariants) {
        case 'colors':
          $scope.form.variants.push({id, type: 'colors', color: '', quantity: 0, sku: $scope.form.sku, imageFile: null, image: `varImg-${id}`});
          break;
        case 'sizes':
          $scope.form.variants.push({id, type: 'sizes', size: '', quantity: 0, sku: $scope.form.sku});
          break;
        case 'colors-sizes':
          $scope.form.variants.push({id, type: 'colors-sizes', size: '', color: '', quantity: 0, sku: $scope.form.sku, imageFile: null, image: `varImg-${id}`});
          break;
        default:
          break;
      }
    };

    $scope.withVariantsOnchange = () => {
      $scope.form.variants = [];
    };

    $scope.deleteItem = (item) => {
      $scope.form.variants = $scope.form.variants.filter((v) => v.id !== item.id);
    };

    $scope.variantPropertyChanged = (item) => {
      if (item.type === 'colors') {
        item.sku = `${$scope.form.sku}-${propertyAbbrev(item.color)}`;
      } else if (item.type === 'sizes') {
        item.sku = `${$scope.form.sku}-${propertyAbbrev(item.size)}`;
      } else {
        item.sku = `${$scope.form.sku}-${propertyAbbrev(item.color)}-${propertyAbbrev(item.size)}`;
      }
    };

    const propertyAbbrev = (value) => {
      if (value.length <= 3) {
        return value;
      } else {
        return value.substring(0,3);
      }
    };


    $scope.submit = () => {
      let productQuantity = null;
      if ($scope.form.withVariants && $scope.form.variants.length) {
        productQuantity = $scope.form.variants.reduce((acc, cur) => acc + cur.quantity, Number(0));
      }
      const product = {
        sku: $scope.form.sku,
        label: $scope.form.label,
        description: $scope.form.description,
        price: $scope.form.price,
        quantity: productQuantity !== null ? productQuantity : $scope.form.quantity,
        lowStockThreshold: $scope.form.lowStockThreshold,
        category_id: $scope.form.selectedCategoryId,
        long_description: $scope.form.presentation,
        promo_price: null,
        manufacturerId: $scope.form.selectedManufacturerId,
        weight: $scope.form.weight,
        images: '',
        video_link: $scope.form.videolink
      };
      $q.all(uploadProductVariantsImages()).then(() => {
        upload($scope.form.files)
        .then((filenames) => {
          if (filenames && filenames.length) {
            product.images = filenames.toString();
            ProductService.add(product)
              .then((result) => {
                if ($scope.form.variants.length) {
                  ProductVariantsService.addAll(getProductVariantsArray(result.data.id))
                    .then(() => {
                      clear();
                      showModal('#successModal');
                    }, () => {
                      showModal("#errorModal");
                    });
                } else {
                  clear();
                  showModal('#successModal');
                }
              }, () => {
                showModal("#errorModal");
              });
          } else {
            ProductService.add(product)
              .then((result) => {
                if ($scope.form.variants.length) {
                  ProductVariantsService.addAll(getProductVariantsArray(result.data.id))
                    .then(() => {
                      clear();
                      showModal('#successModal');
                    }, () => {
                      showModal("#errorModal");
                    });
                } else {
                  clear();
                  showModal('#successModal');
                }
              }, () => {
                showModal("#errorModal");
              });
          }

        }, () => {
          showModal("#errorModal");
        });
      }, () => {
        showModal("#errorModal");
      });
    };

    const upload = (files) => {
      const deferred = $q.defer();
      if (files && files.length) {
        Upload.upload({
          url: 'http://localhost:3000/productupload',
          data: {
            productImages: files
          }
        }).then((resp) => {
          if(resp.data.error_code === 0){
              deferred.resolve(resp.data.files.map((item) => item.filename));
          } else {
              deferred.reject();
          }
        },
        (error) => {
          deferred.reject(error);
        },
        (evt) => {
          console.log(evt);
        });
      } else {
        deferred.resolve();
      }   
      return deferred.promise;
    };

    const uploadProductVariantsImages = () => {
      if ($scope.form.variants.length && $scope.form.variants.some((item) => item.imageFile)) {
        //complete image name for variants with images
        $scope.form.variants = $scope.form.variants.map((variant) => {
          if (variant.imageFile) {
            variant.image = variant.image + '.' + variant.imageFile.name.split('.').pop();
          }
          return variant;
        });

        const variantsWithImages = $scope.form.variants.filter((item) => item.imageFile);
        return variantsWithImages.map((variant) => {
          const deferred = $q.defer();
          Upload.upload({
            url: 'http://localhost:3000/productvariantupload',
            data: {
              file: variant.imageFile
            }
          }).then((resp) => { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                //$window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                deferred.resolve();
            } else {
                deferred.reject();
            }
          },
          (error) => { //catch error
            deferred.reject(error);
          });
          return deferred.promise;
        });
      } else {
        return [];
      }
    };

    const showModal = (id) => {
      const dlgElem = angular.element(id);
      if (dlgElem) {
          dlgElem.modal("show");
      }
    };

    const clear = () => {
      $scope.form = { 
        files: [],
        withVariants: 'none',
        variants: []
      };
    };

    const getProductVariantsArray = (productId) => {
      return $scope.form.variants.map((variant) => ({
        sku: variant.sku,
        product_id: productId,
        color: variant.color,
        size: variant.size,
        quantity: variant.quantity,
        image: variant.image
      }));
    };

}]);