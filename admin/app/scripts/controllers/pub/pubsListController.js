'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:PubsListCtrl
 * @description
 * # MainCtrl
 * Controller of the publications list page
 */

angular.module('sbAdminApp').controller('PubsListCtrl', ['$scope', '$q', 'BlogService', function ($scope, $q, BlogService) {
  $scope.pubs = [];
  $scope.deleteDisabled = true;
  $scope.updateDisabled = true;
  BlogService.getAll().then(function (result) {
    $scope.pubs = result;
  });

  $scope.updateState = function () {
    $scope.deleteDisabled = $scope.pubs.filter(function (item) {
      return item.isSelected;
    }).length === 0;
    $scope.updateDisabled = $scope.pubs.filter(function (item) {
      return item.isSelected;
    }).length !== 1;
  };

  $scope.refreshPubs = function () {
    BlogService.getAll().then(function (result) {
      $scope.pubs = result;
    });
  };

  $scope.delete = function () {
    var ids = $scope.pubs.filter(function (item) {
      return item.isSelected;
    }).map(function (item) {
      return item.id;
    });

    if (ids.length) {
      var promises = ids.map(function (id) {
        return BlogService.remove(id);
      });
      $q.all(promises).then(function () {
        $scope.refreshPubs();
      }, function () {});
    }
  };
}]);