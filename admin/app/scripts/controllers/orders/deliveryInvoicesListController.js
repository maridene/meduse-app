'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:DeliveryInvoicesListCtrl
 * @description
 * # MainCtrl
 * Controller of the delivery invoices list page
 */

angular.module('sbAdminApp').controller('DeliveryInvoicesListCtrl', ['$scope', 'RestService', 'UsersService', 'ModalService', function ($scope, RestService, UsersService, ModalService) {
    function getList() {
        RestService.get('invoice/shipping')
            .then(function(result) {
                $scope.list = result.data.map(function(each) {
                    var invoiceUrl = SERVER_URL + '/static/invoices/' + each.filename;
                    var orderLink = '#/dashboard/order-details/' + each.orderId;
                    var refOrder = ('').concat('<a href=\"').concat(orderLink).concat('\">').concat(each.orderRef).concat('</a>');
                    var clientId = each.filename.split('-')[3];
                    return {
                        id: each.number,
                        url: ('').concat('<a href=\"').concat(invoiceUrl).concat('\">').concat(each.number).concat('</a>'),
                        client: clientId,
                        refOrder: refOrder,
                        filename: each.filename
                    };
                });
                UsersService.getAllClients().then(function (clients) {
                    $scope.list.forEach(function (row) {
                        row.client = findClientNameById(row.client, clients);
                    });
                    $scope.filteredInvoices = $scope.list;
                    $scope.$watch('filterQuery', filterInvoices);
                }, function () {
                });

            });
      };
    function filterInvoices() {
      $scope.filteredInvoices = $scope.list.filter(function(item) {
        return item.client.toUpperCase().includes($scope.filterQuery.toUpperCase())
        || item.refOrder.toUpperCase().includes($scope.filterQuery.toUpperCase())
        || item.id.includes($scope.filterQuery);
      });
      $scope.updateState();
    };

    function init() {
        $scope.filteredInvoices = [];
        $scope.filterQuery = '';
        getList();
        $scope.deleteDisabled = true;
    }

    function findClientNameById(id, list) {
        var found = list.filter(function (each) {
            return '' + each.id === '' + id;
        });
        if (found.length) {
            return found[0].name;
        } else {
            return '-';
        }
    };

    $scope.delete = function(item) {
        doDelete([item.filename])
            .then(function() {
              ModalService.showSuccessModal(INVOICES_DELETED_SUCCESS);
              init();
            });
    };

    $scope.deleteSelected = function() {
        var selected = $scope.filteredInvoices.filter(function(each) {
            return each.isSelected;
        }).map(function(each) {
            return each.filename;
        });
        doDelete(selected)
            .then(function() {
              ModalService.showSuccessModal(INVOICES_DELETED_SUCCESS);
              init();
            });
    };

     function doDelete(files) {
        var data = {files: files.join(',')};
        return RestService.post("invoice/delete", data);
    };

    $scope.updateState = function() {
        $scope.deleteDisabled = $scope.filteredInvoices.filter(function (each) {
            return each.isSelected;
        }).length === 0;
    };

    init();

}]);