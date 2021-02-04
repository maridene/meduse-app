'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', ['$scope', '$q', 'RestService', function($scope, $q, RestService) {
	var monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
	var monthsNumbers = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	
	var getLastNMonthsNames = function(n) {
		var result = [];
		var today = new Date();
		var d;
		var month;
		for(var i = n - 1; i >= 0; i -= 1) {
			d = new Date(today.getFullYear(), today.getMonth() - i, 1);
			month = monthNames[d.getMonth()];
			result.push(month);
		}
		return result;
	};

	var getLastMonthsNumbers = function(n) {
		var result = [];
		var today = new Date();
		var d;
		var month;
		for(var i = n - 1; i >= 0; i -= 1) {
			d = new Date(today.getFullYear(), today.getMonth() - i, 1);
			month = monthsNumbers[d.getMonth()];
			result.push(d.getFullYear() + '-' + month);
		}
		return result;
	};

	var income = {
		labels: getLastNMonthsNames(12),
		series: ['Recette'],
		data: [],
		onClick: function (points, evt) {
		console.log(points, evt);
		}
	};

	var usersOrders = {
	    labels: getLastNMonthsNames(6),
		series: ['Clients', 'Commandes'],
		data: [null, null]
    };

	$scope.initIncomeChart = function () {
		var lastMonths = getLastMonthsNumbers(12);
		var promises = lastMonths.map(function(each) {
			const defered = $q.defer();
			RestService.get('ordersstats/done/month/' + each)
				.then(function(result) {
					if (result.data) {
						if (result.data.orders.length) {
							var total = 0;
							result.data.orders.forEach(function(order) {
								total = total + parseFloat(order.totalInfos.total);
							});
							defered.resolve({month: result.data.month, value: total});
						} else {
							defered.resolve({month : result.data.month, value: 0});
						}
					} else {

					}
					
				});
			return defered.promise;
		});

		$q.all(promises).then(function (result) {
			var lastMonths = getLastMonthsNumbers(12);
			var data = [];
			lastMonths.forEach(function(each) {
				var foundRecords = result.filter(function(record) {
					return record.month === each;
				});
				if (foundRecords.length) {
					data.push(foundRecords[0].value);
				} else {
					data.push(0);
				}
			});
			income.data = [data];
			$scope.income = income;
		});
	};

	$scope.initUsersOrdersChart = function () {
		var lastMonths = getLastMonthsNumbers(6);

		var orderPromises = lastMonths.map(function(each) {
			const defered = $q.defer();
			RestService.get('ordersstats/created/month/' + each)
				.then(function(result) {
					if (result.data && result.data.orders) {
						defered.resolve({month: result.data.month, value: result.data.orders.length});
					}else {
					defered.resolve({month : result.data.month, value: 0});
					}
				});
			return defered.promise;
		});

		var usersPromises = lastMonths.map(function(each) {
			const defered = $q.defer();
			RestService.get('users/created/month/' + each)
				.then(function(result) {
					if (result.data && result.data.clients) {
						defered.resolve({month: result.data.month, value: result.data.clients.length});
					} else {
						defered.resolve({month : result.data.month, value: 0});
					}
				});
			return defered.promise;
		});

		$q.all(orderPromises).then(function (result) {
			var lastMonths = getLastMonthsNumbers(6);
			var data = [];
			lastMonths.forEach(function(each) {
				var foundRecords = result.filter(function(record) {
					return record.month === each;
				});
				if (foundRecords.length) {
					data.push(foundRecords[0].value);
				} else {
					data.push(0);
				}
			});
			usersOrders.data[1] = data;
			$scope.usersOrders = usersOrders;
		});

		$q.all(usersPromises).then(function (result) {
			var lastMonths = getLastMonthsNumbers(6);
			var data = [];
			lastMonths.forEach(function(each) {
				var foundRecords = result.filter(function(record) {
					return record.month === each;
				});
				if (foundRecords.length) {
					data.push(foundRecords[0].value);
				} else {
					data.push(0);
				}
			});
			usersOrders.data[0] = data;
			$scope.usersOrders = usersOrders;
			
		});
	};

	$scope.initIncomeChart();
	$scope.initUsersOrdersChart();

    $scope.pie = {
    	labels : ["Dentaire", "Médical", "Usage sportif", "Hygiène"],
    	data : [3600, 4100, 1100, 800]
    };

  }]);
