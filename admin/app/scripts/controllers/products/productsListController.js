'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ProductsListCtrl
 * @description
 * # MainCtrl
 * Controller of the products list page
 */

angular.module('sbAdminApp').controller('ProductsListCtrl', ['$scope', '$q', 'ProductService', 'CategoryService', 'ManufacturerService', function ($scope, $q, ProductService, CategoryService, ManufacturerService) {
  $scope.selectedCategoryId = null;
  $scope.products = [];
  $scope.deleteDisabled = true;
  CategoryService.getAllCategories().then(function (result) {
    $scope.categories = result;
  });
  ManufacturerService.getAll().then(function (result) {
    $scope.brands = result;
  });

  $scope.getProducts = function () {
    if ($scope.selectedCategoryId) {
      ProductService.getProductsByCategory($scope.selectedCategoryId, 0, 0).then(function (result) {
        $scope.products = result.items;
        $scope.updateState();
      });
    }
  };

  $scope.updateState = function () {
    $scope.deleteDisabled = $scope.products.filter(function (item) {
      return item.isSelected;
    }).length === 0;
  };

  $scope.delete = function () {
    var selectedProducts = $scope.products.filter(function (item) {
      return item.isSelected;
    });
    var ids = selectedProducts.map(function (item) {
      return item.id;
    });

    if (ids.length) {
      var promises = ids.map(function (id) {
        return ProductService.remove(id);
      });
      $q.all(promises).then(function () {
        $scope.getProducts();
        var dlgElem = angular.element("#deleteSuccessModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      }, function () {
        var dlgElem = angular.element("#deleteErrorModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      });
    }
  };
}]);