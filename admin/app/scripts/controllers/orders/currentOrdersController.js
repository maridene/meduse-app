'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:CurrentOrdersCtrl
 * @description
 * # MainCtrl
 * Controller of the current orders page
 */
angular.module('sbAdminApp')
  .controller('CurrentOrdersCtrl', ['$scope', 'OrdersService', function ($scope, OrdersService) {
    $scope.orders = [
      {
        id: 'CM0000001',
        date: '10/02/2020',
        client: 'foulen ben foulen',
        total: '210,500',
        state: 'en cours'
      },
      {
        id: 'CM0000002',
        date: '19/07/2020',
        client: 'foulen ben foulen',
        total: '110,500',
        state: 'en cours'
      },
      {
        id: 'CM0000003',
        date: '01/02/2020',
        client: 'foulen ben foulen',
        total: '1781,000',
        state: 'en cours'
      },
      {
        id: 'CM0000004',
        date: '10/02/2020',
        client: 'foulen ben foulen',
        total: '5210,900',
        state: 'en cours'
      }
    ];
}]);