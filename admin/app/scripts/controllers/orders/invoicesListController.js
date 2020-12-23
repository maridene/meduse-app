'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:InvoicesListCtrl
 * @description
 * # MainCtrl
 * Controller of the invoices list page
 */

angular.module('sbAdminApp').controller('InvoicesListCtrl', ['$scope', 'RestService', function ($scope, RestService) {
    $scope.getList = function() {
        RestService.get('invoice/invoices')
            .then(function(result) {
                $scope.list = result.data.map(function(each) {
                    var url = SERVER_URL + '/static/invoices/' + each.filename;
                    var id = ('').concat('<a href=\"').concat(url).concat('\">').concat(each.number).concat('</a>');
                    var orderLink = '#/dashboard/order-details/' + each.orderId;
                    var refOrder = ('').concat('<a href=\"').concat(orderLink).concat('\">').concat(each.orderRef).concat('</a>');
                    return {
                        id: id,
                        refOrder: refOrder,
                    };
                });
                $scope.table = angular.element(document.querySelector('#table-subscribers'));
                $scope.table.bootstrapTable('destroy')
                            .bootstrapTable({
                                data: $scope.list
                            });
            });
  };

  $scope.getList();
}]);