'use strict';

angular.module('meduseApp.aboutUs', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/aboutUs', {
        templateUrl: 'views/aboutUs/aboutUs.html',
        controller: 'AboutUsCtrl'
      });
    }])

    .controller('AboutUsCtrl', [function() {

    }]);