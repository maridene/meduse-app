'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:SettingsCtrl
 * @description
 * # MainCtrl
 * Controller of the settings page
 */

angular.module('sbAdminApp').controller('SettingsCtrl', ['$scope', '$window', '$q', 'RestService', function ($scope, $window, $q, RestService) {
    $scope.shippingForm = {
        canApply: false
    };
    $scope.invoicesForm = {
        canApply: false
    };
    $scope.originalShippingData = {};
    $scope.originalInvoicesData = {};

    $scope.shippingDataChanged = function() {
        $scope.shippingForm.freeFromDisabled = $scope.shippingForm.free;
        $scope.shippingForm.canApply = $scope.originalShippingData.free !== $scope.shippingForm.free
        || $scope.originalShippingData.shippingFee !== $scope.shippingForm.shippingFee
        || $scope.originalShippingData.freeFrom !== $scope.shippingForm.freeFrom ;
    };

    $scope.invoicesDataChanged = function() {
        $scope.invoicesForm.canApply = $scope.originalInvoicesData.nextInvoiceNumber !== $scope.invoicesForm.nextInvoiceNumber
        || $scope.originalInvoicesData.nextDeliveryInvoiceNumber !== $scope.invoicesForm.nextDeliveryInvoiceNumber
        || $scope.originalInvoicesData.nextCreditInvoiceNumber !== $scope.invoicesForm.nextCreditInvoiceNumber ;
    };

    RestService.get('settings/type/shipping').then(function(result) {
        $scope.shippingForm.free = result.data.filter(function(item) {
            return item.label === 'free';
        })[0].value === '0' ? false : true;
        $scope.originalShippingData.free = $scope.shippingForm.free;
        $scope.shippingForm.freeFromDisabled = $scope.shippingForm.free;
        $scope.shippingForm.shippingFee = parseFloat(result.data.filter(function(item) {
            return item.label === 'shippingFee';
        })[0].value);
        $scope.originalShippingData.shippingFee = $scope.shippingForm.shippingFee;

        $scope.shippingForm.freeFrom = parseFloat(result.data.filter(function(item) {
            return item.label === 'freeFrom';
        })[0].value);
        $scope.originalShippingData.freeFrom = $scope.shippingForm.freeFrom;
    });

    RestService.get('settings/type/invoice').then(function(result) {
        const value = +result.data[0].value;
        $scope.originalInvoicesData.nextInvoiceNumber = value;
        $scope.invoicesForm.nextInvoiceNumber = +value;
    });

    RestService.get('settings/type/delivery-invoice').then(function(result) {
        const value = +result.data[0].value;
        $scope.originalInvoicesData.nextDeliveryInvoiceNumber = value;
        $scope.invoicesForm.nextDeliveryInvoiceNumber = value;
    });

    RestService.get('settings/type/credit invoice').then(function(result) {
        const value = +result.data[0].value;
        $scope.originalInvoicesData.nextCreditInvoiceNumber = value;
        $scope.invoicesForm.nextCreditInvoiceNumber = value;
    });

    $scope.updateShippingSettings = function() {
        var promises = [].concat(RestService.put('settings/free', {value: $scope.shippingForm.free ? 1 : 0}))
        .concat(RestService.put('settings/shippingFee', {value: $scope.shippingForm.shippingFee}))
        .concat(RestService.put('settings/freeFrom', {value: $scope.shippingForm.freeFrom}));

        $q.all(promises)
            .then(function () {
                $window.location.reload();
            }, function(error) {

            });
    };

    $scope.updateInvoicesSettings = function() {
        var nextInvoice = !isNaN($scope.invoicesForm.nextInvoiceNumber) && $scope.invoicesForm.nextInvoiceNumber ?  
            $scope.invoicesForm.nextInvoiceNumber : 1;
        var nextDeliveryInvoice = !isNaN($scope.invoicesForm.nextDeliveryInvoiceNumber) && $scope.invoicesForm.nextDeliveryInvoiceNumber ? 
            $scope.invoicesForm.nextDeliveryInvoiceNumber: 1;
        var nextCreditInvoice = !isNaN($scope.invoicesForm.nextCreditInvoiceNumber) && $scope.invoicesForm.nextCreditInvoiceNumber ?  
            $scope.invoicesForm.nextCreditInvoiceNumber : 1;

        var promises = []
        .concat(RestService.put('settings/nextInvoice', {value: nextInvoice}))
        .concat(RestService.put('settings/nextDeliveryInvoice', {value: nextDeliveryInvoice}))
        .concat(RestService.put('settings/nextCreditInvoice', {value: nextCreditInvoice}));

        $q.all(promises)
            .then(function () {
                $window.location.reload();
            }, function(error) {

            });
    };
}])