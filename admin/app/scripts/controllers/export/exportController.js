'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ExportCtrl
 * @description
 * # MainCtrl
 * Controller of the export page
 */

angular.module('sbAdminApp').controller('ExportCtrl', ['$scope', '$window', '$q', 'RestService', function ($scope, $window, $q, RestService) {

    $scope.exportClientsCSV = function () {
        RestService.get('export/clients/csv')
            .then(function(result) {
                var file = new Blob([result.data], { type: 'text/csv' });
                saveAs(file, 'clients.csv');
            });
    };

    $scope.exportClientsMExcel = function () {
        RestService.get('export/clients/mexcel')
            .then(function(result) {
                //var file = new Blob([base64ToArrayBuffer(result.data)], { type: 'application/application/vnd.ms-excel'});
                var file = new Blob([result.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(file, 'clients.xlsx');
            });
    };

    $scope.exportProductsCSV = function () {
        RestService.get('export/products/csv')
            .then(function(result) {
                var file = new Blob([result.data], { type: 'text/csv' });
                saveAs(file, 'products.csv');
            });
    };

    $scope.exportProductsMExcel = function () {
        RestService.get('export/products/mexcel')
            .then(function(result) {
                var file = new Blob([result.data], { type: 'text/csv' });
                saveAs(file, 'products.xlsx');
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