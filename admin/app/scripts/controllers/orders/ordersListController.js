'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:OrdersListCtrl
 * @description
 * # MainCtrl
 * Controller of the orders list page
 */
angular.module('sbAdminApp')
  .controller('OrdersListCtrl', ['$scope', 'OrdersService', function ($scope, OrdersService) {
    $scope.orders = [];
    
    $scope.filteredOrders = [];
    $scope.selectedPaymentFilter = 'all';
    $scope.filterQuery = '';
    $scope.selectedOrderStatus = null;
    $scope.selectedPaymentStatus = 'all';

    var filterOrders = function() {
      switch($scope.selectedPaymentStatus) {
        case 'all':
          $scope.filteredOrders = $scope.orders;
          break;
        
        case '0':
          $scope.filteredOrders = $scope.orders.filter(function(item) {
            return item.payment_status ===  0; 
          });
          break; 
        
        case '1':
          $scope.filteredOrders = $scope.orders.filter(function(item) {
            return item.payment_status === 1; 
          });
          break;
      }

      switch($scope.selectedPaymentFilter) {
        case 'all':
          $scope.filteredOrders = $scope.filteredOrders;
          break;
        
        case 'e':
          $scope.filteredOrders = $scope.filteredOrders.filter(function(item) {
            return item.ptype ===  'Espèces'; 
          });
          break; 
        
        case 'c':
          $scope.filteredOrders = $scope.filteredOrders.filter(function(item) {
            return item.ptype === 'Chèque'; 
          });
          break;
        case 'v':
           $scope.filteredOrders = $scope.filteredOrders.filter(function(item) {
             return item.ptype === 'Virement';
           });
          break;
        }
      
      $scope.filteredOrders = $scope.filteredOrders.filter(function(item) {
        return item.ref.toLowerCase().includes($scope.filterQuery.toLowerCase()) || item.client.toLowerCase().includes($scope.filterQuery.toLowerCase())
            || item.agentName.toLowerCase().includes($scope.filterQuery.toLowerCase());
      });
    };

    function getOrders(status) {
      if (status) {
        $scope.selectedPaymentFilter = 'all';
        $scope.filterQuery = '';
        $scope.selectedPaymentStatus = 'all';
        OrdersService.search(status).then(function(result) {
          $scope.orders = result.map(function(item) {

            return {
              id: item.id,
              ref: item.order_ref,
              client: item.clientName,
              ptype: ptypeMapper(item.ptype),
              date: formatDateTime(item.order_date),
              payment_status: item.payment_status,
              total: item.total,
              agentName: item.agentName || ''
            }
          });
          $scope.filteredOrders = $scope.orders;
        });
      }
    }

    $scope.$watch('selectedOrderStatus', getOrders);

    $scope.$watch('[selectedPaymentStatus, filterQuery, selectedPaymentFilter]', filterOrders, true);
    
}]);