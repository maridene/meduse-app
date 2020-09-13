'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddCategoryCtrl
 * @description
 * # MainCtrl
 * Controller of the add category page
 */
angular.module('sbAdminApp')
  .controller('AddCategoryCtrl', ['$scope', '$timeout', 'CategoryService', function ($scope, $timeout, CategoryService) {
    
    $scope.name= '';
    $scope.description = '';
    
    const clear = () => {
      $scope.name = '';
      $scope.description = '';
    }

    $scope.submit = function () {
      CategoryService.addCategory({label: $scope.name, description: $scope.description})
        .then(() => {
          clear();
        }, (error) => {
          
        });
    }
}]);