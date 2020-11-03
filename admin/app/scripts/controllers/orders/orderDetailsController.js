'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:OrderDetailsCtrl
 * @description
 * # MainCtrl
 * Controller of the order details page
 */
angular.module('sbAdminApp')
  .controller('OrderDetailsCtrl', ['$scope', '$stateParams', '$window', 'OrdersService', 'OrderRowsService', 'UsersService', 'ProductService', 
  function ($scope, $stateParams, OrdersService, OrderRowsService, UsersService, ProductService) {
    $scope.order = {};
    $scope.rows = [];
    $scope.form = {
      message: ''
    };
    OrdersService.getById($stateParams.id).then(
        function(order) {
          
          $scope.order = enrichOrder(order);
          $scope.possibleStatuses = getPossibleNextStatuses($scope.order.order_status);
          $scope.form.selectedOrderStatus = $scope.possibleStatuses[0].key;
          $scope.form.selectedPaymentStatus = $scope.order.payment_status;
          $scope.disableApply = true;

          console.log($scope.order);
          OrderRowsService.getByOrderId(order.id).then(
            function (orderRows) {
              $scope.orderRows = orderRows;
              orderRows.forEach(function(row) {
                ProductService.getProductById(row.productId)
                  .then(function(result) {
                    const selectedVariant = row.variantId ? result.variants.filter(function(item) {
                      return item.id === row.variantId;
                    })[0] : null;
                    const orderRow = {
                      label: getProductLabel(result.product, selectedVariant),
                      quantity : row.quantity,
                      price: result.product.price,
                      promo_price: result.product.promo_price,
                      availability: getAvailability(result.product, selectedVariant, row.quantity),
                      details: {product: result.product, variant: selectedVariant, quantity: row.quantity}
                    };
                    $scope.rows.push(orderRow);
                  })
              })

          });
          UsersService.getById(order.client_id).then(
            function (client) {
              $scope.client = client;
          });

        }, function() {
          $state.go('dashboard.current-orders');
        }
    );

    $scope.$watch('[form.selectedOrderStatus, form.selectedPaymentStatus]', function() {
      if ($scope.form.selectedOrderStatus === $scope.order.order_status 
        && $scope.form.selectedPaymentStatus == $scope.order.payment_status) {
          $scope.disableApply = true;
        } else {
          $scope.disableApply = false;
        }
    }, true);

    $scope.apply = function() {
      var data = {
        order_status: $scope.form.selectedOrderStatus,
        payment_status: $scope.form.selectedPaymentStatus,
        admin_message: $scope.form.message
      }

      OrdersService.updateById($scope.order.id, data)
        .then(function() {
          $window.location.reload();
        }, function(error) {

        });
    };

    function getProductLabel(product, selectedVariant) {
      let label = product.label;
      if (selectedVariant) {
        if (selectedVariant.color && selectedVariant.size) {
          label = label + ' - ' + selectedVariant.color + ' - ' + selectedVariant.size;
        } else if (selectedVariant.color) {
          label = label + ' - ' + selectedVariant.color;
        } else {
          label = label + ' - ' + selectedVariant.size;
        }
      }
      return label;
    }

    function getAvailability(product, variant, quantity) {
      if (variant) {
        return variant.quantity >= quantity;
      } else {
        return product.quantity >= quantity;
      }
    }

    function enrichOrder(order) {
      order.date = formatDateTime(order.order_date);
      order.paymentStatus = paymentStatusMapper(order.payment_status);
      order.paymentType = ptypeMapper(order.ptype);
      order.status = orderStatusMapper(order.order_status);
      order.canceledDate = order.canceled_date ? formatDateTime(order.canceled_date) : null;
      order.shippedDate = order.shipped_date ? formatDateTime(order.shipped_date) : null;
      return order;
    }
}]);