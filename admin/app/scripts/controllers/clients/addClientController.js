'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddClientCtrl
 * @description
 * # MainCtrl
 * Controller of the add client page
 */

angular.module('sbAdminApp').controller('AddClientCtrl', ['$scope', 'UsersService', function ($scope, UsersService) {
  
  $scope.initForm = function() {
    $scope.password = '';
    $scope.passwordConfirm = '';
    $scope.addToNewsLetter = false;
    $scope.form = {
      prefix: 'M.',
      name: '',
      email: '',
      phone: '',
      password: '',
      mf: ''
    };
  };

  $scope.initForm();

  $scope.submit = function () {
    if ($scope.password !== $scope.passwordConfirm) {
      showModal("#pwdErrorModal");
    } else {
      $scope.form.password = sha3_256($scope.password);
      UsersService.addClient($scope.form).then(function () {
        $scope.initForm();
        showModal("#successModal");
      }, function (error) {
        showModal("#errorModal");
      });
    }
  };

  var showModal = function showModal(id) {
    var dlgElem = angular.element(id);

    if (dlgElem) {
      dlgElem.modal("show");
    }
  };
  
}]);