'use strict';

angular.module('meduseApp.contact', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/contact', {
        templateUrl: 'views/contact/contact.html',
        controller: 'ContactCtrl'
      });
    }])

    .controller('ContactCtrl', [function() {

    }]);