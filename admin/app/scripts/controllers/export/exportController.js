'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ExportCtrl
 * @description
 * # MainCtrl
 * Controller of the export page
 */

angular.module('sbAdminApp').controller('ExportCtrl', ['$scope', '$window', '$q', 'RestService', function ($scope, $window, $q, RestService) {

    $scope.exportClients = function () {
        RestService.get('export/clients')
            .then(function(result) {
                var file = new Blob([result.data], { type: 'text/csv' });
                saveAs(file, 'clients.csv');
            });
    };

    $scope.exportProducts = function () {
        RestService.get('export/products')
            .then(function(result) {
                var file = new Blob([result.data], { type: 'text/csv' });
                saveAs(file, 'products.csv');
            });
    };

    $scope.exportOrders = function () {
        RestService.get('export/orders')
            .then(function(result) {
                var file = new Blob([result.data], { type: 'text/csv' });
                saveAs(file, 'orders.csv');
            });
    };
}])