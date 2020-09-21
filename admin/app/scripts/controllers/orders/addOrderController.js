'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddOrderCtrl
 * @description
 * # MainCtrl
 * Controller of the add order page
 */
angular.module('sbAdminApp')
  .controller('AddOrderCtrl', ['$scope', 'OrdersService', function ($scope, OrdersService) {
    
    $scope.name= '';
    $scope.description = '';
    
    const clear = () => {
      $scope.name = '';
      $scope.description = '';
    }

    $scope.submit = function () {
        OrdersService.add({clientId: $scope.clientId, description: $scope.description})
        .then(() => {
          clear();
          const dlgElem = angular.element("#successModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        }, (error) => {
          const dlgElem = angular.element("#errorModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        });
    }
}]);