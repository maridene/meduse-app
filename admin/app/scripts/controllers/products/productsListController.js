'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ProductsListCtrl
 * @description
 * # MainCtrl
 * Controller of the products list page
 */
angular.module('sbAdminApp')
  .controller('ProductsListCtrl', ['$scope', '$q', 'ProductService', 'CategoryService', 'ManufacturerService',
  function ($scope, $q, ProductService, CategoryService, ManufacturerService) {
    $scope.selectedCategoryId = null;
    $scope.products = [];
    $scope.deleteDisabled = true;
    
    CategoryService.getAllCategories()
      .then((result) => {
        $scope.categories = result;
      })

    ManufacturerService.getAll()
      .then((result) => {
        $scope.brands = result;
      });
    

   $scope.getProducts = () => {
     if ($scope.selectedCategoryId) {
       ProductService.getProductsByCategory($scope.selectedCategoryId, 0, 20)
        .then((result) => {
          $scope.products = result.items;
          $scope.updateState();
        })
     }
   }

   $scope.updateState = () => {
    $scope.deleteDisabled = $scope.products.filter((item) => item.isSelected).length === 0;
  };

  $scope.delete = () => {
    const selectedProducts = $scope.products.filter((item) => item.isSelected);
    const ids = selectedProducts.map((item) => item.id);
    if (ids.length) {
      const promises = ids.map((id) => ProductService.remove(id));
      $q.all(promises)
        .then(() => {
          $scope.getProducts();
          const dlgElem = angular.element("#deleteSuccessModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        }, () => {
          const dlgElem = angular.element("#deleteErrorModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        });
    }
  };
}]);