'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:UnpaidOrdersCtrl
 * @description
 * # MainCtrl
 * Controller of the unpaid orders page
 */
angular.module('sbAdminApp')
  .controller('UnpaidOrdersCtrl', ['$scope', 'OrdersService', function ($scope, OrdersService) {
    $scope.orders = [];
    
    $scope.filteredOrders = [];
    $scope.selectedPaymentFilter = 'all';
    $scope.filterQuery = '';

    OrdersService.search('shipped', 0).then(function(result) {
        $scope.orders = result.map(function(item) {
          return {
            id: item.id,
            ref: item.order_ref,
            client: item.clientName,
            ptype: item.ptype === 'c' ? 'Chèque' : 'Espèces',
            date: formatDateTime(item.order_date),
            shippedDate: formatDateTime(item.shipped_date)
          }
        });
        $scope.filteredOrders = $scope.orders;
    });

    var filterOrders = function() {
      switch($scope.selectedPaymentFilter) {
        case 'all':
          $scope.filteredOrders = $scope.orders;
          break;
        
        case 'Espèces':
          $scope.filteredOrders = $scope.orders.filter(function(item) {
            return item.ptype ===  'Espèces'; 
          });
          break; 
        
        case 'Chèque':
          $scope.filteredOrders = $scope.orders.filter(function(item) {
            return item.ptype === 'Chèque'; 
          });
          break;
      }
      
      $scope.filteredOrders = $scope.filteredOrders.filter(function(item) {
        return item.ref.toLowerCase().includes($scope.filterQuery.toLowerCase()) || item.client.toLowerCase().includes($scope.filterQuery.toLowerCase());
      });
    };
  
    $scope.$watch('[filterQuery, selectedPaymentFilter]', filterOrders, true);
    
}]);