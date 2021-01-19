'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:CategoriesOrderCtrl
 * @description
 * # MainCtrl
 * Controller of the reorder categories page
 */

angular.module('sbAdminApp').controller('CategoriesOrderCtrl', ['$scope', 'CategoryService', function ($scope, CategoryService) {
  var errorModal = '#errorModal';
  
  $scope.getAllCategories = function () {
    CategoryService.getAllCategories().then(function (result) {
        $scope.categories = result;
        var categories = $scope.categories.map(function(item) {
            return {
                id: item.id,
                label: item.label,
                description: item.description
            };
        });
    
        $scope.table = angular.element(document.querySelector('#table-reorder'));
            $scope.table.bootstrapTable('destroy')
                        .bootstrapTable({
                            data: categories
                        });
            $scope.table.off('reorder-row.bs.table', updateOrders);
            $scope.table.on('reorder-row.bs.table', updateOrders);
      });
  };

  $scope.getAllCategories();
  

  $scope.apply = function() {
      var data = $scope.table.bootstrapTable('getData', true);
  }

  var updateOrders = function() {
        var data = $scope.table.bootstrapTable('getData', true);
        var dataWithOrder = data.map(function(each, index){
            return {order: index, id: each.id};
        });
        CategoryService.updateOrders(dataWithOrder)
            .then(function() {
                $scope.getAllCategories();
            }, function() {
                showModal(errorModal);
            });
  };


  var showModal = function(id) {
    var dlgElem = angular.element(id);
        if (dlgElem) {
          dlgElem.modal("show");
        }
  };

}]);