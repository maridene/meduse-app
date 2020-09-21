'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddProductCtrl
 * @description
 * # MainCtrl
 * Controller of the add product page
 */
angular.module('sbAdminApp')
  .controller('AddProductCtrl', ['$scope', 'CategoryService', 'ProductService', function ($scope, CategoryService, ProductService) {
    CategoryService.getAllCategories()
      .then((result) => {
        $scope.categories = result;
      })
}]);