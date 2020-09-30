'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddOrderCtrl
 * @description
 * # MainCtrl
 * Controller of the add order page
 */

angular.module('sbAdminApp').controller('AddOrderCtrl', ['$scope', 'OrdersService', function ($scope, OrdersService) {
  $scope.name = '';
  $scope.description = '';

  var clear = function clear() {
    $scope.name = '';
    $scope.description = '';
  };

  $scope.submit = function () {
    OrdersService.add({
      clientId: $scope.clientId,
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