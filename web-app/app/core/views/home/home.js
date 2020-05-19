'use strict';

angular.module('meduseApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'core/views/home/home.html',
        controller: 'HomeCtrl'
      });
    }])

    .controller('HomeCtrl', [function() {

    }]);