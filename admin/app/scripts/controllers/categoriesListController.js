'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:CategoriesListCtrl
 * @description
 * # MainCtrl
 * Controller of the categories list page
 */
angular.module('sbAdminApp')
  .controller('CategoriesListCtrl', ['$scope', '$q', 'CategoryService', function ($scope, $q, CategoryService) {
    $scope.deleteDisabled = true;
    CategoryService.getAllCategories()
      .then((result) => {
        $scope.categories = result;
      });

    $scope.updateState = () => {
      $scope.deleteDisabled = $scope.categories.filter((item) => item.isSelected).length === 0;
    };

    $scope.refreshCategories = () => {
      CategoryService.getAllCategories()
      .then((result) => {
        $scope.categories = result;
      });
    };

    $scope.delete = () => {
      const ids = $scope.categories.filter((item) => item.isSelected).map((item) => item.id);
      if (ids.length) {
        const promises = ids.map((id) => CategoryService.removeCategory(id));
        $q.all(promises)
          .then(() => {
            $scope.refreshCategories();
          }, () => {

          });
      }
    };
}]);