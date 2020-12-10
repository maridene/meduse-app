'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:SendMailCtrl
 * @description
 * # MainCtrl
 * Controller of the send mail page
 */

angular.module('sbAdminApp').controller('SendMailCtrl', ['$scope', '$q', 'RestService', function ($scope, $q, RestService) {

    var successModalId = '#successModal';
    var errorModalId = '#errorModal';

    

    var showModal = function showModal(id) {
        var dlgElem = angular.element(id);
        if (dlgElem) {
        dlgElem.modal("show");
        }
    };
    
}]);