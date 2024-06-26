'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ProductsListCtrl
 * @description
 * # MainCtrl
 * Controller of the products list page
 */

angular.module('sbAdminApp').controller('ProductsListCtrl', ['$scope', '$q', '$state', 'ProductService', 'CategoryService', 'ManufacturerService', function ($scope, $q, $state, ProductService, CategoryService, ManufacturerService) {
  $scope.selectedCategoryId = null;
  $scope.products = [];
  $scope.filteredProducts = [];
  $scope.selectedFilter = 'all';
  $scope.filterQuery = '';

  $scope.updateState = function () {
    var selectedItemsCount = $scope.filteredProducts.filter(function (item) {
      return item.isSelected;
    }).length;

    $scope.deleteDisabled = selectedItemsCount === 0;
  };

  $scope.updateState();
  
  //TODO: move to resolve
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
        $scope.filteredProducts = result.items;
        filterProducts();
        $scope.updateState();
      });
    }
  };

  $scope.delete = function () {
    var selectedProducts = $scope.filteredProducts.filter(function (item) {
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

  $scope.update = function () {
    var selectedProductId = $scope.products.filter(function (item) {
      return item.isSelected;
    })[0].id;
    $state.go('dashboard.edit-product', {
      productId: selectedProductId
    });
  };

  var filterProducts = function() {
    switch($scope.selectedFilter) {
      case 'all':
        $scope.filteredProducts = $scope.products;
        break;
      case 'promo':
        $scope.filteredProducts = $scope.products.filter(function(item) {
          return item.promo_price; 
        });
        break; 
      case 'lowStock':
        $scope.filteredProducts = $scope.products.filter(function(item) {
          return item.quantity !== 0 &&  item.quantity <= item.lowStockThreshold; 
        });
        break;
      case 'outOfStock':
        $scope.filteredProducts = $scope.products.filter(function(item) {
          return item.quantity === 0; 
        });
        break;
      case 'pinned':
        $scope.filteredProducts = $scope.products.filter(function(item) {
          return item.pinned; 
        });
        break;
      case 'new':
        $scope.filteredProducts = $scope.products.filter(function(item) {
          return item.isNew; 
        });
        break;
      case 'exclusif':
        $scope.filteredProducts = $scope.products.filter(function(item) {
          return item.isExclusif; 
        });
        break;
      case 'hidden':
        $scope.filteredProducts = $scope.products.filter(function(item) {
          return item.isHidden; 
        });
        break;
    }
    
    $scope.filteredProducts = $scope.filteredProducts.filter(function(item) {
      return item.label.includes($scope.filterQuery) || item.sku.includes($scope.filterQuery);
    });
  };

  $scope.$watch('[filterQuery, selectedFilter]', filterProducts, true);

  $scope.updateIsPinned = function(product) {
    var newValue = product.pinned ? 1 : 0;
    ProductService.pin(product.id, newValue)
      .then(function() {
        $scope.getProducts();
      }, function() {

      });
  };

  $scope.updateIsNew = function(product) {
    var newValue = product.isNew ? 1 : 0;
    ProductService.updateIsNew(product.id, newValue)
      .then(function() {
        $scope.getProducts();
      }, function() {

      });
  };

  $scope.updateIsExclusif = function(product) {
    var newValue = product.isExclusif ? 1 : 0;
    ProductService.updateIsExclusif(product.id, newValue)
      .then(function() {
        $scope.getProducts();
      }, function() {

      });
  };

  $scope.updateIsHidden = function(product) {
    var newValue = product.isHidden ? 1 : 0;
    ProductService.updateIsHidden(product.id, newValue)
      .then(function() {
        $scope.getProducts();
      }, function() {

      });
  };
}]);