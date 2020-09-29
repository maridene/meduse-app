'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('headerNotification',function(){

		const headerController = function ($scope, $state, AuthenticationService) {
			$scope.logout = function () {
				console.log('ok');
				AuthenticationService.clearCredentials();
				$state.go('login');
			};
		};

		return {
			templateUrl:'scripts/directives/header/header-notification/header-notification.html',
			restrict: 'E',
			replace: true,
			controller: headerController
    	}
	});


