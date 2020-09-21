'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ManufacturersListCtrl
 * @description
 * # MainCtrl
 * Controller of the manufacturers list page
 */
angular.module('sbAdminApp')
  .controller('ManufacturersListCtrl', ['$scope', '$q', '$state', 'ManufacturerService', function ($scope, $q, $state, ManufacturerService) {
    
    $scope.deleteDisabled = true;
    $scope.updateDisabled = true;

    ManufacturerService.getAll()
      .then((result) => {
        
        console.log(result);
        $scope.manufacturers = result;
      });

    $scope.updateState = () => {
      $scope.deleteDisabled = $scope.manufacturers.filter((item) => item.isSelected).length === 0;
      $scope.updateDisabled = $scope.manufacturers.filter((item) => item.isSelected).length !== 1;
    };

    $scope.refreshManufacturers = () => {
      ManufacturerService.getAll()
      .then((result) => {
        $scope.manufacturers = result;
      });
    };

    $scope.delete = () => {
      const selectedManufacturers = $scope.manufacturers.filter((item) => item.isSelected);
      const ids = selectedManufacturers.map((item) => item.id);
      if (ids.length) {
        if (selectedManufacturers.filter((item) => item.productsCount > 0).length > 0) {
          const dlgElem = angular.element("#deleteImpossibleModal");
            if (dlgElem) {
                dlgElem.modal("show");
            }
        } else {
          const promises = ids.map((id) => ManufacturerService.remove(id));
          $q.all(promises)
            .then(() => {
              $scope.refreshManufacturers();
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
        
      }
    };

    $scope.update = () => {
      const selectedManufacturerId = $scope.manufacturers.filter((item) => item.isSelected)[0].id;
      $state.go('dashboard.edit-manufacturer', {
        manufacturerId: selectedManufacturerId
      });
    };

}]);