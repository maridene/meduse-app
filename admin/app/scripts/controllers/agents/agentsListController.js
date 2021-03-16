'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AgentsListCtrl
 * @description
 * # MainCtrl
 * Controller of the Agents list page
 */
angular.module('sbAdminApp')
    .controller('AgentsListCtrl', ['$scope', '$q', '$state', 'AgentsService', function ($scope, $q, $state, AgentsService) {

        $scope.buildTable = function () {
            $scope.table = angular.element(document.querySelector('#table-subscribers'));
            $scope.table.bootstrapTable('destroy')
                .bootstrapTable({
                    data: $scope.list
                });
        };

        $scope.getList = function () {
            AgentsService.getAll()
                .then(function (result) {
                    $scope.list = result.map(function (each) {
                        return {
                            id: each.id,
                            name: each.name,
                            creationDate: getDateFromDatetime(each.creationDate),
                            modificationDate: getDateFromDatetime(each.modificationDate)
                        };
                    });
                    $scope.buildTable();
                });
        };

        $scope.submit = function() {
            const name = $scope.lastname + " " + $scope.firstname;
            AgentsService.add(name)
                .then(function(result) {
                    clear();
                    $scope.getList();
                }, function(error) {

                });
        };

        function clear() {
            $scope.lastname = "";
            $scope.firstname = "";
        }

        $scope.getList();

        

    }]);