'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddManufacturerCtrl
 * @description
 * # MainCtrl
 * Controller of the add manufacturer page
 */
angular.module('sbAdminApp')
  .controller('AddManufacturerCtrl', ['$scope', 'ManufacturerService', function ($scop, ManufacturerService) {
    
    $scope.addManufacturer = () => {
      const manufacturer = {name: $scope.name, website: $scope.webSite};
      ManufacturerService.add(manufacturer)
        .then(() => {
          clear();
          const dlgElem = angular.element("#successModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        }, () => {
          const dlgElem = angular.element("#errorModal");
          if (dlgElem) {
              dlgElem.modal("show");
          }
        });
    };

    const clear = () => {
      $scope.name = '';
      $scope.webSite = '';
    };
}]);