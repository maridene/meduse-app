'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ReorderProductsCtrl
 * @description
 * # MainCtrl
 * Controller of the reorder products page
 */

angular.module('sbAdminApp').controller('ReorderProductsCtrl', ['$scope', '$q', 'ProductService', 'CategoryService', function ($scope, $q, ProductService, CategoryService) {
  var errorModal = '#errorModal';
  $scope.selectedCategoryId = null;
  $scope.products = [];
  $scope.filteredProducts = [];
  
  //TODO: move to resolve
  CategoryService.getAllCategories().then(function (result) {
    $scope.categories = result;
  });

  $scope.getProducts = function () {
    if ($scope.selectedCategoryId) {
      ProductService.getProductsByCategory($scope.selectedCategoryId, 0, 0).then(function (result) {
        $scope.products = result.items;
        var products = $scope.products.map(function(item) {
            return {
                id: item.id,
                label: item.label,
                manufacturer: item.manufacturerName,
                quantity: item.quantity
            };
        });
        $scope.table = angular.element(document.querySelector('#table-reorder'));
        $scope.table.bootstrapTable('destroy')
                    .bootstrapTable({
                        data: products
                    });
        $scope.table.off('reorder-row.bs.table', updateOrders);
        $scope.table.on('reorder-row.bs.table', updateOrders);
      });
    }
  };

  $scope.apply = function() {
      var data = $scope.table.bootstrapTable('getData', true);
      console.log(data.map(function(i) {return i.label}));
  }

  var updateOrders = function() {
        var data = $scope.table.bootstrapTable('getData', true);
        var dataWithOrder = data.map(function(each, index){
            return {orderIndex: index, id: each.id};
        });
        ProductService.updateOrders(dataWithOrder)
            .then(function() {
                $scope.getProducts();
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