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
    
    $scope.orders = [];
    
    $scope.filteredOrders = [];
    $scope.selectedPaymentFilter = 'all';
    $scope.filterQuery = '';

    OrdersService.search('new').then(function(result) {
        $scope.orders = result.map(function(item) {
          return {
            id: item.id,
            ref: item.order_ref,
            client: item.clientName,
            ptype: ptypeMapper(item.ptype),
            date: formatDateTime(item.order_date)
          }
        });
        $scope.filteredOrders = $scope.orders;
    });

    var filterOrders = function() {
      switch($scope.selectedPaymentFilter) {
        case 'all':
          $scope.filteredOrders = $scope.orders;
          break;
        
        case 'e':
          $scope.filteredOrders = $scope.orders.filter(function(item) {
            return item.ptype ===  'Espèces'; 
          });
          break; 
        
        case 'c':
          $scope.filteredOrders = $scope.orders.filter(function(item) {
            return item.ptype === 'Chèque'; 
          });
          break;

        case 'v':
          $scope.filteredOrders = $scope.orders.filter(function(item) {
            return item.ptype === 'Virement';
          });
          break;
      }
      
      $scope.filteredOrders = $scope.filteredOrders.filter(function(item) {
        return item.ref.toLowerCase().includes($scope.filterQuery.toLowerCase()) || item.client.toLowerCase().includes($scope.filterQuery.toLowerCase());
      });
    };
  
    $scope.$watch('[filterQuery, selectedPaymentFilter]', filterOrders, true);
    
}]);