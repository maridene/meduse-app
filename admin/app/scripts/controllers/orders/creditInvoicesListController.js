'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:CreditInvoicesListCtrl
 * @description
 * # MainCtrl
 * Controller of the invoices list page
 */

angular.module('sbAdminApp').controller('CreditInvoicesListCtrl', ['$scope', 'RestService', 'UsersService', function ($scope, RestService, UsersService) {
    $scope.getList = function() {
        RestService.get('invoice/credit')
            .then(function(result) {
                $scope.list = result.data.map(function(each) {
                    var url = SERVER_URL + '/static/invoices/' + each.filename;
                    var id = ('').concat('<a href=\"').concat(url).concat('\">').concat(each.number).concat('</a>');
                    var orderLink = '#/dashboard/order-details/' + each.orderId;
                    var refOrder = ('').concat('<a href=\"').concat(orderLink).concat('\">').concat(each.orderRef).concat('</a>');
                    var clientId = each.filename.split('-')[3];
                    return {
                        id: id,
                        client: clientId,
                        refOrder: refOrder,
                    };
                });
                UsersService.getAllClients().then(function (clients) {
                    $scope.list.forEach(function (row) {
                        row.client = findClientNameById(row.client, clients);
                    });
                    $scope.buildTable();
                }, function () {
                    $scope.buildTable();
                });
                
            });

            const findClientNameById = function (id, list) {
                var found = list.filter(function (each) {
                    return '' + each.id === '' + id;
                });
                if (found.length) {
                    return found[0].name;
                } else {
                    return '-';
                }
            };

            $scope.buildTable = function()  {
                $scope.table = angular.element(document.querySelector('#table-subscribers'));
                $scope.table.bootstrapTable('destroy')
                            .bootstrapTable({
                                data: $scope.list
                            });
            };
  };

  $scope.getList();
}]);