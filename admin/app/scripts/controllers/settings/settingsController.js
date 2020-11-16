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
    $scope.originalShippingData = {};

    $scope.shippingDataChanged = function() {
        $scope.shippingForm.freeFromDisabled = $scope.shippingForm.free;
        $scope.shippingForm.canApply = $scope.originalShippingData.free !== $scope.shippingForm.free
        || $scope.originalShippingData.shippingFee !== $scope.shippingForm.shippingFee
        || $scope.originalShippingData.freeFrom !== $scope.shippingForm.freeFrom ;
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
}])