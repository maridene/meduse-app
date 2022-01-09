'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:EditClientCtrl
 * @description
 * # MainCtrl
 * Controller of the edit client page
 */

angular.module('sbAdminApp').controller('EditClientCtrl', ['$scope', '$q', 'UsersService', '$stateParams', 'ModalService',
function ($scope, $q, UsersService, $stateParams, ModalService) {

    function loadClient(id) {
        UsersService.getClientById(id)
            .then(function(data) {
                $scope.client = data;
                $scope.form = {
                    prefix: data.prefix,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    phone2: data.phone2,
                    mf: data.mf
                };
            }, function(error) {
                this.notFound = true;
            });
    }

    $scope.notFound = false;
    var clientId = $stateParams.id;
    loadClient(clientId);

    $scope.submit = function () {
       UsersService.updateClient($scope.client.id, $scope.form)
        .then(function() {
            loadClient(clientId);
            ModalService.showSuccessModal(EDIT_CLIENT_SUCCESS_MESSAGE);
        });
    };

}]);