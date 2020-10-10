'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ClientsListCtrl
 * @description
 * # MainCtrl
 * Controller of the clients list page
 */

angular.module('sbAdminApp').controller('ClientsListCtrl', ['$scope', '$q', 'UsersService', 
function ($scope, $q, UsersService) {
  
  $scope.clients = [];
  $scope.filteredClients = [];
  $scope.filterQuery = '';

  $scope.updateState = function () {
    var selectedItemsCount = $scope.filteredClients.filter(function (item) {
      return item.isSelected;
    }).length;

    $scope.deleteDisabled = selectedItemsCount === 0;
    $scope.updateDisabled = selectedItemsCount !== 1;
  };

  $scope.updateState();

  $scope.getClients = function () {
    UsersService.getAllClients().then(function (result) {
      $scope.clients = result;
      $scope.filteredClients = result;
      $scope.updateState();
    });
  };

  $scope.getClients();

  var filterClients = function() {
    $scope.filteredClients = $scope.clients.filter(function(item) {
      return item.name.includes($scope.filterQuery) || item.email.includes($scope.filterQuery);
    });
  };

  $scope.$watch('filterQuery', filterClients);

  $scope.delete = function() {
    var selectedClients = $scope.filteredClients.filter(function(client) {
      return client.isSelected;
    });
    if (selectedClients.length === 0) {
      return;
    } else {
      var selectedClientsIds = selectedClients.map(function(item) {
        return item.id;
      });
      var promises = selectedClientsIds.map(function(item){
        return UsersService.remove(item);
      });
      $q.all(promises).then(function() {
        $scope.getClients();
        filterClients();
        var dlgElem = angular.element("#deleteSuccessModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      }, function(error) {
        var dlgElem = angular.element("#errorModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      });
    }
  };

}]);