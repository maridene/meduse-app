'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddClientCtrl
 * @description
 * # MainCtrl
 * Controller of the add client page
 */
angular.module('sbAdminApp')
  .controller('AddClientCtrl', ['$scope', 'ClientsService', function ($scope, ClientsService) {
    
    $scope.name= '';
    $scope.description = '';
    
    const clear = () => {
      $scope.name = '';
      $scope.description = '';
    }

    $scope.submit = function () {
        ClientsService.add({label: $scope.name, description: $scope.description})
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