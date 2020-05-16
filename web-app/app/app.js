'use strict';

// Declare app level module which depends on views, and core components
angular.module('meduseApp', [
  'ngRoute',
  'meduseApp.view1',
  'meduseApp.view2',
  'meduseApp.home',
  'meduseApp.contact',
  'meduseApp.aboutUs',
  'meduseApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
