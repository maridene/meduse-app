'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:OrderDetailsCtrl
 * @description
 * # MainCtrl
 * Controller of the order details page
 */
angular.module('sbAdminApp')
  .controller('OrderDetailsCtrl', ['$scope', '$stateParams', '$window', 'RestService', 'OrdersService', 'OrderRowsService', 'UsersService', 'ProductService', 'CouponsService', 
  function ($scope, $stateParams, $window, RestService, OrdersService, OrderRowsService, UsersService, ProductService, CouponsService) {
    $scope.order = {};
    $scope.coupon = {};
    $scope.totalInfo = {};
    $scope.rows = [];
    $scope.form = {
      message: ''
    };

    $scope.invoiceForm = {
      invoiceDate: new Date(),
      clientMF: '',
      deliveryInvoiceDate: new Date()
    };

    OrdersService.getById($stateParams.id).then(
        function(order) {
          
          $scope.order = enrichOrder(order);
          $scope.possibleStatuses = getPossibleNextStatuses($scope.order.order_status);
          $scope.form.selectedOrderStatus = $scope.possibleStatuses[0].key;
          $scope.form.selectedPaymentStatus = $scope.order.payment_status;
          $scope.disableApply = true;

          if ($scope.order.coupon_id !== null && $scope.order.coupon_id !== null)  {
            CouponsService.getById(order.coupon_id).then(function (result) {
              $scope.coupon = result;
            });
          }

          OrdersService.totalInfo(order.id).then(function (result) {
            $scope.totalInfo = result;
          });

          console.log($scope.order);
          OrderRowsService.getByOrderId(order.id).then(
            function (orderRows) {
              $scope.orderRows = orderRows;
              orderRows.forEach(function(row) {
                ProductService.getProductById(row.productId)
                  .then(function(result) {
                    var selectedVariant = row.variantId ? result.variants.filter(function(item) {
                      return item.id === row.variantId;
                    })[0] : null;
                    var orderRow = {
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
              $scope.invoiceForm.clientMF = client.mf;
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
      var label = product.label;
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


    $scope.getInvoice = function () {
      var data = {
        mf: $scope.invoiceForm.clientMF,
        date: $scope.invoiceForm.invoiceDate ? new Date($scope.invoiceForm.invoiceDate).getTime() : null
      };
      console.log(data);
      RestService.post('orders/' + $scope.order.id + '/invoice', data)
        .then(function(response) {
          var fileUrl = SERVER_URL + '/static/invoices/' + response.data.filename;
          $window.open(fileUrl, '_blank');
        });
    };

    $scope.getDeliveryInvoice = function () {
      var data = {
        mf: $scope.invoiceForm.clientMF,
        date: $scope.invoiceForm.deliveryInvoiceDate ? new Date($scope.invoiceForm.deliveryInvoiceDate).getTime() : null
      };
      console.log(data);
      RestService.post('orders/' + $scope.order.id + '/deliveryInvoice', data)
        .then(function(response) {
          var fileUrl = SERVER_URL + '/static/invoices/' + response.data.filename;
          $window.open(fileUrl, '_blank');
        });
    };
}]);