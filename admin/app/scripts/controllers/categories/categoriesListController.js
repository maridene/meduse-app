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
      .then((result) => {
        $scope.categories = result;
      });

    $scope.updateState = () => {
      $scope.deleteDisabled = $scope.categories.filter((item) => item.isSelected).length === 0;
      $scope.updateDisabled = $scope.categories.filter((item) => item.isSelected).length !== 1;
    };

    $scope.refreshCategories = () => {
      CategoryService.getAllCategories()
      .then((result) => {
        $scope.categories = result;
        $scope.updateState();
      });
    };

    $scope.delete = () => {
      const selectedCategories = $scope.categories.filter((item) => item.isSelected);
      const ids = selectedCategories.map((item) => item.id);
      if (ids.length) {
        if (selectedCategories.filter((item) => item.productsCount > 0).length) {
          const dlgElem = angular.element("#deleteImpossibleModal");
            if (dlgElem) {
                dlgElem.modal("show");
            }
        } else {
          const promises = ids.map((id) => CategoryService.removeCategory(id));
          $q.all(promises)
            .then(() => {
              $scope.refreshCategories();
              const dlgElem = angular.element("#deleteSuccessModal");
              if (dlgElem) {
                  dlgElem.modal("show");
              }
            }, () => {
              const dlgElem = angular.element("#deleteErrorModal");
              if (dlgElem) {
                  dlgElem.modal("show");
              }
            });
        }
        
      }
    };

    $scope.update = () => {
      const selectedCategoryId = $scope.categories.filter((item) => item.isSelected)[0].id;
      $state.go('dashboard.edit-category', {
        categoryId: selectedCategoryId
      });
    };

}]);