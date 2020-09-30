'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddManufacturerCtrl
 * @description
 * # MainCtrl
 * Controller of the add manufacturer page
 */

angular.module('sbAdminApp').controller('AddManufacturerCtrl', ['$scope', 'ManufacturerService', function ($scope, ManufacturerService) {
  $scope.addManufacturer = function () {
    var manufacturer = {
      name: $scope.name,
      website: $scope.webSite
    };
    ManufacturerService.add(manufacturer).then(function () {
      clear();
      var dlgElem = angular.element("#successModal");

      if (dlgElem) {
        dlgElem.modal("show");
      }
    }, function () {
      var dlgElem = angular.element("#errorModal");

      if (dlgElem) {
        dlgElem.modal("show");
      }
    });
  };

  var clear = function clear() {
    $scope.name = '';
    $scope.webSite = '';
  };
}]);