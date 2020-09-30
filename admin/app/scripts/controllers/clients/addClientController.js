'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddClientCtrl
 * @description
 * # MainCtrl
 * Controller of the add client page
 */

angular.module('sbAdminApp').controller('AddClientCtrl', ['$scope', 'ClientsService', function ($scope, ClientsService) {
  $scope.name = '';
  $scope.description = '';

  var clear = function clear() {
    $scope.name = '';
    $scope.description = '';
  };

  $scope.submit = function () {
    ClientsService.add({
      label: $scope.name,
      description: $scope.description
    }).then(function () {
      clear();
      var dlgElem = angular.element("#successModal");

      if (dlgElem) {
        dlgElem.modal("show");
      }
    }, function (error) {
      var dlgElem = angular.element("#errorModal");

      if (dlgElem) {
        dlgElem.modal("show");
      }
    });
  };
}]);