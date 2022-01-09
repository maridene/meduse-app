'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ClientCtrl
 * @description
 * # MainCtrl
 * Controller of the client page
 */

angular.module('sbAdminApp').controller('ClientCtrl', ['$scope', '$stateParams', 'UsersService', 'OrdersService', 'ModalService', function ($scope, $stateParams, UsersService, OrdersService, ModalService) {
	function loadClient(id) {
        UsersService.getClientById(id)
            .then(function(data) {
                $scope.client = data;
            }, function(error) {
                this.notFound = true;
            });
    };

    function loadClientOrders(id) {
        OrdersService.getByClientId(id)
            .then(function(result) {
                $scope.orders = result.map(function(item) {

                    return {
                      id: item.id,
                      ref: item.order_ref,
                      client: item.clientName,
                      ptype: ptypeMapper(item.ptype),
                      date: formatDateTime(item.order_date),
                      status: orderStatusMapper(item.order_status),
                      paymentStatus: item.payment_status == 0 ? 'Non payée' : 'Payée',
                      total: item.total,
                      agentName: item.agentName || ''
                    }
            });
        });
    };

    $scope.notFound = false;
    $scope.orders = [];
    var clientId = $stateParams.id;
    loadClient(clientId);
    loadClientOrders(clientId);
}]);
