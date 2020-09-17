'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ManufacturersListCtrl
 * @description
 * # MainCtrl
 * Controller of the manufacturers list page
 */
angular.module('sbAdminApp')
  .controller('ManufacturersListCtrl', ['$scope', 'ManufacturerService', function ($scope, ManufacturerService) {
    
    $scope.deleteDisabled = true;
    ManufacturerService.getAll()
      .then((result) => {
        
        console.log(result);
        $scope.manufacturers = result;
      });

    $scope.updateState = () => {
      $scope.deleteDisabled = $scope.manufacturers.filter((item) => item.isSelected).length === 0;
    };

    $scope.refreshManufacturers = () => {
      ManufacturerService.getAll()
      .then((result) => {
        $scope.manufacturers = result;
      });
    };

    $scope.delete = () => {
      const ids = $scope.manufacturers.filter((item) => item.isSelected).map((item) => item.id);
      if (ids.length) {
        const promises = ids.map((id) => ManufacturerService.remove(id));
        $q.all(promises)
          .then(() => {
            $scope.refreshManufacturers();
          }, () => {

          });
      }
    };

}]);