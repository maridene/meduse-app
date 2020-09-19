'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope,$position) {
    $scope.line = {
	    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
	    series: ['Recette'],
	    data: [
	      [1200, 2250, 1950, 1988, 2560, 3330, 3500, 4200, 4800, 4123, 4448, 3950]
	    ],
	    onClick: function (points, evt) {
	      console.log(points, evt);
	    }
    };

    $scope.pie = {
    	labels : ["Dentaire", "Médical", "Usage sportif", "Hygiène"],
    	data : [3600, 4100, 1100, 800]
    };

    $scope.bar = {
	    labels: ['Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre'],
		  series: ['Clients', 'Commandes'],

		data: [
		   [65, 59, 80, 81, 56, 55],
		   [28, 48, 40, 19, 86, 27]
		]
    	
    };
  });
