'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ClientsListCtrl
 * @description
 * # MainCtrl
 * Controller of the clients list page
 */

angular.module('sbAdminApp').controller('ClientsListCtrl', ['$scope', 'ClientsService', function ($scope, ClientsService) {
  $scope.clients = [{
    id: 1,
    name: 'Mohamed Aziz Ridene',
    phone: '58591411',
    email: 'medaziz.ridene@gmail.com',
    signupDate: '14/07/1019'
  }, {
    id: 2,
    name: 'Mohamed Aziz Ridene',
    phone: '58591411',
    email: 'medaziz.ridene@gmail.com',
    signupDate: '14/07/1019'
  }];
  $scope.deleteDisabled = true;
  $scope.updateDisabled = true;
  /*
  ClientsService.getAll()
    .then((result) => {
      $scope.clients = result;
    });
    */

  $scope.updateState = function () {
    $scope.deleteDisabled = $scope.clients.filter(function (item) {
      return item.isSelected;
    }).length === 0;
    $scope.updateDisabled = $scope.clients.filter(function (item) {
      return item.isSelected;
    }).length !== 1;
  };
  /*
  $scope.refreshClients = () => {
    ClientsService.getAll()
    .then((result) => {
      $scope.clients = result;
    });
  };
   $scope.delete = () => {
    const ids = $scope.clients.filter((item) => item.isSelected).map((item) => item.id);
    if (ids.length) {
      const promises = ids.map((id) => ClientsService.remove(id));
      $q.all(promises)
        .then(() => {
          $scope.refreshClients();
        }, () => {
         });
    }
  };*/

}]);