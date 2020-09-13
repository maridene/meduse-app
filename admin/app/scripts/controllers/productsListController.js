'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ProductsListCtrl
 * @description
 * # MainCtrl
 * Controller of the products list page
 */
angular.module('sbAdminApp')
  .controller('ProductsListCtrl', ['$scope', 'ProductService', 'CategoryService', function ($scope, ProductService, CategoryService) {
    $scope.selectedCategoryId = null;
    $scope.products = [];
    
    CategoryService.getAllCategories()
      .then((result) => {
        $scope.categories = result;
      })
    

   $scope.getProducts = () => {
     if ($scope.selectedCategoryId) {
       ProductService.getProductsByCategory($scope.selectedCategoryId, 0, 20)
        .then((result) => {
          $scope.products = result.items;
        })
     }
   }
}]);