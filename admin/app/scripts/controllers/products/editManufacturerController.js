'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:EditManufacturerCtrl
 * @description
 * # MainCtrl
 * Controller of the edit manufacturer page
 */
angular.module('sbAdminApp')
  .controller('EditManufacturerCtrl', ['$scope', '$state', 'ManufacturerService', 'manufacturer', function ($scope, $state, ManufacturerService, manufacturer) {
    
    $scope.manufacturer = manufacturer;

    const allDialogElements = angular.element('.modal');
    
    if (allDialogElements) {
      allDialogElements.on('hidden.bs.modal', (e) => {
        $state.go('dashboard.manufacturers-list');
      });
    }

    $scope.submit = function () {
      if (!isBlank($scope.manufacturer.name)) {
        ManufacturerService.update($scope.manufacturer.id, {name: $scope.manufacturer.name, website: $scope.manufacturer.webSite})
          .then(() => {
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
      
    }

}]);