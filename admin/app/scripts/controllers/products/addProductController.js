'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddProductCtrl
 * @description
 * # MainCtrl
 * Controller of the add product page
 */
angular.module('sbAdminApp')
  .controller('AddProductCtrl', ['categories', 'manufacturers', '$scope', '$q', 'Upload', 'ProductService', 
  function (categories, manufacturers, $scope, $q, Upload, ProductService) {
    
    $scope.categories = categories;
    $scope.manufacturers = manufacturers;
    $scope.form = { files: []};

    $scope.$watch('form', () => {
      if (typeof $scope.form.selectedManufacturerId !== 'undefined' 
      && typeof $scope.form.selectedCategoryId !== 'undefined'
      && $scope.form.label) {
        const selectedCategoryName = $scope.categories.filter((item) => item.id == $scope.form.selectedCategoryId)[0].label;
        const selectedManufName = $scope.manufacturers.filter((item) => item.id == $scope.form.selectedManufacturerId)[0].name;

        $scope.form.sku = `${selectedCategoryName}-${selectedManufName}-${skuFromProductLabel($scope.form.label)}`;
      }
    }, true);


    $scope.submit = () => {
      upload($scope.form.files)
        .then((filenames) => {
          if (filenames && filenames.length) {
            const product = {
              sku: $scope.form.sku,
              label: $scope.form.label,
              description: $scope.form.description,
              price: $scope.form.price,
              quantity: $scope.form.quantity,
              lowStockThreshold: $scope.form.lowStockThreshold,
              category_id: $scope.form.selectedCategoryId,
              long_description: $scope.form.presentation,
              promo_price: null,
              manufacturerId: $scope.form.selectedManufacturerId,
              weight: $scope.form.weight,
              images: filenames.toString(),
              video_link: $scope.form.videolink
            };

            ProductService.add(product)
              .then(() => {
                clear();
                showModal('#successModal');
              }, () => {
                showModal("#errorModal");
              });
          } else {

          }
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
      }   
      return deferred.promise;
    };

    const showModal = (id) => {
      const dlgElem = angular.element(id);
      if (dlgElem) {
          dlgElem.modal("show");
      }
    };

    const clear = () => {
      $scope.form = {files: []};
    };

}]);