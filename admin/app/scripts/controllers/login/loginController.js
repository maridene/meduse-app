'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:LoginCtrl
 * @description
 * # MainCtrl
 * Controller of the login page
 */

angular.module('sbAdminApp').controller('LoginCtrl', ['$scope', '$state', 'AuthenticationService', function ($scope, $state, AuthenticationService) {
  $scope.submit = function () {
    var hashedPassword = sha3_256($scope.password);
    AuthenticationService.authenticate($scope.email, hashedPassword).then(function (user) {
      AuthenticationService.setCredentials(user);
      $state.go('dashboard.home');
    }, function (error) {});
  };
}]);