'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ManufacturersListCtrl
 * @description
 * # MainCtrl
 * Controller of the manufacturers list page
 */

angular.module('sbAdminApp').controller('ManufacturersListCtrl', ['$scope', '$q', '$state', 'ManufacturerService', function ($scope, $q, $state, ManufacturerService) {
  $scope.deleteDisabled = true;
  $scope.updateDisabled = true;
  ManufacturerService.getAll().then(function (result) {
    console.log(result);
    $scope.manufacturers = result;
  });

  $scope.updateState = function () {
    $scope.deleteDisabled = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    }).length === 0;
    $scope.updateDisabled = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    }).length !== 1;
  };

  $scope.refreshManufacturers = function () {
    ManufacturerService.getAll().then(function (result) {
      $scope.manufacturers = result;
      $scope.updateState();
    });
  };

  $scope.delete = function () {
    var selectedManufacturers = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    });
    var ids = selectedManufacturers.map(function (item) {
      return item.id;
    });

    if (ids.length) {
      if (selectedManufacturers.filter(function (item) {
        return item.productsCount > 0;
      }).length > 0) {
        var dlgElem = angular.element("#deleteImpossibleModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      } else {
        var promises = ids.map(function (id) {
          return ManufacturerService.remove(id);
        });
        $q.all(promises).then(function () {
          $scope.refreshManufacturers();
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
    }
  };

  $scope.update = function () {
    var selectedManufacturerId = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    })[0].id;
    $state.go('dashboard.edit-manufacturer', {
      manufacturerId: selectedManufacturerId
    });
  };
}]);
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:ManufacturersListCtrl
 * @description
 * # MainCtrl
 * Controller of the manufacturers list page
 */


angular.module('sbAdminApp').controller('ManufacturersListCtrl', ['$scope', '$q', '$state', 'ManufacturerService', function ($scope, $q, $state, ManufacturerService) {
  $scope.deleteDisabled = true;
  $scope.updateDisabled = true;
  ManufacturerService.getAll().then(function (result) {
    console.log(result);
    $scope.manufacturers = result;
  });

  $scope.updateState = function () {
    $scope.deleteDisabled = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    }).length === 0;
    $scope.updateDisabled = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    }).length !== 1;
  };

  $scope.refreshManufacturers = function () {
    ManufacturerService.getAll().then(function (result) {
      $scope.manufacturers = result;
      $scope.updateState();
    });
  };

  $scope.delete = function () {
    var selectedManufacturers = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    });
    var ids = selectedManufacturers.map(function (item) {
      return item.id;
    });

    if (ids.length) {
      if (selectedManufacturers.filter(function (item) {
        return item.productsCount > 0;
      }).length > 0) {
        var dlgElem = angular.element("#deleteImpossibleModal");

        if (dlgElem) {
          dlgElem.modal("show");
        }
      } else {
        var promises = ids.map(function (id) {
          return ManufacturerService.remove(id);
        });
        $q.all(promises).then(function () {
          $scope.refreshManufacturers();
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
    }
  };

  $scope.update = function () {
    var selectedManufacturerId = $scope.manufacturers.filter(function (item) {
      return item.isSelected;
    })[0].id;
    $state.go('dashboard.edit-manufacturer', {
      manufacturerId: selectedManufacturerId
    });
  };
}]);