'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:EditCategoryCtrl
 * @description
 * # MainCtrl
 * Controller of the edit category page
 */

angular.module('sbAdminApp').controller('EditCategoryCtrl', ['$scope', '$state', 'CategoryService', 'category', function ($scope, $state, CategoryService, category) {
  $scope.category = category;
  var allDialogElements = angular.element('.modal');

  if (allDialogElements) {
    allDialogElements.on('hidden.bs.modal', function (e) {
      $state.go('dashboard.categories-list');
    });
  }

  $scope.submit = function () {
    if (!isBlank($scope.category.label)) {
      CategoryService.update($scope.category.id, {
        label: $scope.category.label,
        description: $scope.category.description
      }).then(function () {
        var dlgElem = angular.element("#successModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      }, function (error) {
        var dlgElem = angular.element("#errorModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      });
    }
  };
}]);