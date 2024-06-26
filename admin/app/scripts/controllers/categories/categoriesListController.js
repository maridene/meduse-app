'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:CategoriesListCtrl
 * @description
 * # MainCtrl
 * Controller of the categories list page
 */
angular.module('sbAdminApp')
  .controller('CategoriesListCtrl', ['$scope', '$q', '$state', 'CategoryService', function ($scope, $q, $state, CategoryService) {
    $scope.deleteDisabled = true;
    $scope.updateDisabled = true;

    CategoryService.getAllCategories()
      .then(function (result) {
        $scope.categories = result;
      });

    $scope.updateState = function(){
      $scope.deleteDisabled = $scope.categories.filter(function (item) { return item.isSelected}).length === 0;
      $scope.updateDisabled = $scope.categories.filter(function (item) { return item.isSelected}).length !== 1;
    };

    $scope.refreshCategories = function () {
      CategoryService.getAllCategories()
      .then(function(result) {
        $scope.categories = result;
        $scope.updateState();
      });
    };

    $scope.delete = function () {
      const selectedCategories = $scope.categories.filter(function (item) {return item.isSelected});
      const ids = selectedCategories.map(function(item) {return item.id});
      if (ids.length) {
        if (selectedCategories.filter(function (item) { return item.productsCount > 0}).length) {
          const dlgElem = angular.element("#deleteImpossibleModal");
            if (dlgElem) {
                dlgElem.modal("show");
            }
        } else {
          const promises = ids.map(function (id) { return CategoryService.removeCategory(id)});
          $q.all(promises)
            .then(function () {
              $scope.refreshCategories();
              const dlgElem = angular.element("#deleteSuccessModal");
              if (dlgElem) {
                  dlgElem.modal("show");
              }
            }, function () {
              const dlgElem = angular.element("#deleteErrorModal");
              if (dlgElem) {
                  dlgElem.modal("show");
              }
            });
        }
        
      }
    };

    $scope.update = function () {
      const selectedCategoryId = $scope.categories.filter(function(item) {return item.isSelected})[0].id;
      $state.go('dashboard.edit-category', {
        categoryId: selectedCategoryId
      });
    };

}]);