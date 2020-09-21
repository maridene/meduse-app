'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:PubsListCtrl
 * @description
 * # MainCtrl
 * Controller of the publications list page
 */
angular.module('sbAdminApp')
  .controller('PubsListCtrl', ['$scope', 'BlogService', function ($scope, BlogService) {
    $scope.pubs = [];
    $scope.deleteDisabled = true;
    $scope.updateDisabled = true;

    BlogService.getAll()
      .then((result) => {
        $scope.pubs = result;
      });

    $scope.updateState = () => {
      $scope.deleteDisabled = $scope.pubs.filter((item) => item.isSelected).length === 0;
      $scope.updateDisabled = $scope.pubs.filter((item) => item.isSelected).length !== 1;
    };

    $scope.refreshPubs = () => {
      BlogService.getAll()
      .then((result) => {
        $scope.pubs = result;
      });
    };

    $scope.delete = () => {
      const ids = $scope.pubs.filter((item) => item.isSelected).map((item) => item.id);
      if (ids.length) {
        const promises = ids.map((id) => BlogService.remove(id));
        $q.all(promises)
          .then(() => {
            $scope.refreshPubs();
          }, () => {

          });
      }
    };
}]);