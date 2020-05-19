'use strict';

angular.module('meduseApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'src/views/home/home.html',
        controller: 'HomeCtrl'
      });
    }])

    .controller('HomeCtrl', [function() {

    }]);