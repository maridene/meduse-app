'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:SubscribersCtrl
 * @description
 * # MainCtrl
 * Controller of the subscribers page
 */

angular.module('sbAdminApp').controller('SubscribersCtrl', ['$scope', '$q', 'RestService', function ($scope, $q, RestService) {

    var successModalId = '#deleteSuccessModal';
    var errorModalId = '#errorModal';

    $scope.disableDelete = true;

    $scope.getList = function() {
        RestService.get('subscribe')
            .then(function(result) {
                $scope.list = result.data.map(function(each) {
                    return {
                        id: each.id,
                        email: each.email,
                        date: getDateFromDatetime(each.ts)
                    };
                });
                $scope.table = angular.element(document.querySelector('#table-subscribers'));
                $scope.table.bootstrapTable('destroy')
                            .bootstrapTable({
                                data: $scope.list
                            });
                $scope.table.off('check.bs.table', updateDisableDelete);
                $scope.table.off('uncheck.bs.table', updateDisableDelete);
                $scope.table.on('check.bs.table', updateDisableDelete);
                $scope.table.on('uncheck.bs.table', updateDisableDelete);
            });
  };

  $scope.getList();

  var updateDisableDelete = function () {
    var selectedItems = $scope.table.bootstrapTable('getSelections');
    $scope.$evalAsync(function() {
        $scope.disableDelete = selectedItems.length === 0;
    });
  };

  var showModal = function showModal(id) {
    var dlgElem = angular.element(id);
    if (dlgElem) {
      dlgElem.modal("show");
    }
  };

  $scope.delete = function () {
    var promises = $scope.table.bootstrapTable('getSelections')
        .map(function(each) { 
            return RestService.delete('subscribe/' + each.id) 
        });
    if (promises.length) {
        $q.all(promises).then(function() {
            showModal(successModalId);
            $scope.getList();
        }, function () {
            showModal(errorModalId);
        });
    }
  };
    
}]);