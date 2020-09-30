'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddCategoryCtrl
 * @description
 * # MainCtrl
 * Controller of the add category page
 */
angular.module('sbAdminApp')
  .controller('AddCategoryCtrl', ['$scope', 'CategoryService', function ($scope, CategoryService) {
    
    $scope.name= '';
    $scope.description = '';
    
    function clear() {
      $scope.name = '';
      $scope.description = '';
    };

    $scope.submit = function () {
      CategoryService.addCategory({label: $scope.name, description: $scope.description})
        .then(function() {
          clear();
          const dlgElem = angular.element("#successModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        }, function(error) {
          $scope.error = error;
          const dlgElem = angular.element("#errorModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        });
    }
}]);