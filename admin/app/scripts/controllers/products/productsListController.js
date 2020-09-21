'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ProductsListCtrl
 * @description
 * # MainCtrl
 * Controller of the products list page
 */
angular.module('sbAdminApp')
  .controller('ProductsListCtrl', ['$scope', 'ProductService', 'CategoryService', 'ManufacturerService',
  function ($scope, ProductService, CategoryService, ManufacturerService) {
    $scope.selectedCategoryId = null;
    $scope.products = [];
    
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
        })
     }
   }
}]);