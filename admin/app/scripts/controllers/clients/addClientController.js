'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddClientCtrl
 * @description
 * # MainCtrl
 * Controller of the add client page
 */

angular.module('sbAdminApp').controller('AddClientCtrl', ['$scope', 'UsersService', 'ModalService', function ($scope, UsersService, ModalService) {
  
  $scope.initForm = function() {
    $scope.password = '';
    $scope.passwordConfirm = '';
    $scope.addToNewsLetter = false;
    $scope.form = {
      prefix: 'M.',
      name: '',
      email: '',
      phone: '',
      phone2: '',
      password: '',
      mf: ''
    };
  };

  $scope.initForm();

  $scope.submit = function () {
    if ($scope.password !== $scope.passwordConfirm) {
      ModalService.showWarningModal(ADD_CLIENT_CHECK_PASSWORD);
    } else {
      $scope.form.password = sha3_256($scope.password);
      UsersService.addClient($scope.form).then(function () {
        $scope.initForm();
        ModalService.showSuccessModal(ADD_CLIENT_SUCCESS_MESSAGE);
      }, function (error) {
        if (error.data && error.data.kind === "email_not_available") {
            ModalService.showErrorModal(ADD_CLIENT_EMAIL_UNAVAILABLE_MESSAGE)
        } else {
            ModalService.showErrorModal(ADD_CLIENT_ERROR_MESSAGE);
        }
      });
    }
  };
  
}]);