'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:OrderDetailsCtrl
 * @description
 * # MainCtrl
 * Controller of the order details page
 */
angular.module('sbAdminApp')
  .controller('OrderDetailsCtrl', ['$scope', '$stateParams', '$window', '$q', 'RestService', 'CategoryService', 'OrdersService', 'OrderRowsService', 'UsersService', 'ProductService', 'ProductVariantsService', 'CouponsService', 
  function ($scope, $stateParams, $window, $q, RestService, CategoryService, OrdersService, OrderRowsService, UsersService, ProductService, ProductVariantsService, CouponsService) {
    $scope.order = {};
    $scope.coupon = {};
    $scope.totalInfo = {};
    $scope.rows = [];
    $scope.form = {
      message: ''
    };

    //Edit rows Form
    $scope.addInProgress = false;
    $scope.rowQuantityChanged = false;
    $scope.categories = [];
    $scope.addProductForm = {
      selectedCategoryId: null,
      productsForCategory : [],
      selectedProduct: null,
      variantsForProduct : [],
      selectedVariantIdForProduct: null
    };

    $scope.invoiceForm = {
      invoiceDate: new Date(),
      clientMF: '',
      deliveryInvoiceDate: new Date()
    };

    CategoryService.getAllCategories().then(function(result) {
      if (result.length) {
        $scope.categories = result;
        $scope.addProductForm.selectedCategoryId = result.length ? result[0].id : null;
        ProductService.getProductsByCategory(result[0].id)
          .then(function(productsForCategory) {
            if (productsForCategory.items.length) {
              $scope.addProductForm.productsForCategory = productsForCategory.items;
              $scope.addProductForm.selectedProduct = productsForCategory.items[0].id;
              ProductVariantsService.getByProductId(productsForCategory.items[0].id)
                .then(function(variants) {
                  if (variants && variants.length) {
                    $scope.addProductForm.variantsForProduct = variants;
                    $scope.addProductForm.selectedVariantIdForProduct = variants[0].id;
                  } else {
                    $scope.addProductForm.variantsForProduct = [];
                    $scope.addProductForm.selectedVariantIdForProduct = null;
                  }
                  
                })
            } else {
              $scope.addProductForm.productsForCategory = [];
              $scope.addProductForm.selectedProduct = null;
            }
            
          });
      }
      
    });

    $scope.$watch('addProductForm.selectedCategoryId', function() {
      $scope.addProductForm.productsForCategory = [];
      $scope.addProductForm.selectedProduct = null;
      $scope.addProductForm.variantsForProduct = [];
      $scope.addProductForm.selectedVariantIdForProduct = null;

      ProductService.getProductsByCategory($scope.addProductForm.selectedCategoryId)
        .then(function(productsForCategory) {
          if (productsForCategory.items.length) {
            $scope.addProductForm.productsForCategory = productsForCategory.items;
            $scope.addProductForm.selectedProduct = productsForCategory.items[0].id;
            ProductVariantsService.getByProductId(productsForCategory.items[0].id)
                .then(function(variants) {
                  if (variants && variants.length) {
                    $scope.addProductForm.variantsForProduct = variants;
                    $scope.addProductForm.selectedVariantIdForProduct = variants[0].id;
                  } else {
                    $scope.addProductForm.variantsForProduct = [];
                    $scope.addProductForm.selectedVariantIdForProduct = null;
                  }
                  
                });
          } else {
            $scope.addProductForm.productsForCategory = [];
            $scope.addProductForm.selectedProduct = null;
          }
        });
    });

    $scope.$watch('addProductForm.selectedProduct', function() {
      if ($scope.addProductForm.selectedProduct) {
        ProductVariantsService.getByProductId($scope.addProductForm.selectedProduct)
        .then(function(variants) {
          if (variants && variants.length) {
            $scope.addProductForm.variantsForProduct = variants;
            $scope.addProductForm.selectedVariantIdForProduct = variants[0].id;
          } else {
            $scope.addProductForm.variantsForProduct = [];
            $scope.addProductForm.selectedVariantIdForProduct = null;
          }
        });
      }
    });

    $scope.submitRow = function() {
      if ($scope.checkSubmitRow()) {

      } else {
        var data = {
          product_id: $scope.addProductForm.selectedProduct,
          variant_id: $scope.addProductForm.selectedVariantIdForProduct,
          quantity: 1,
          order_id: $scope.order.id
        };
        OrderRowsService.add(data)
          .then(function() {
            $window.location.reload();
          });
      }
    };

    OrdersService.getById($stateParams.id).then(
        function(order) {
          
          $scope.order = enrichOrder(order);
          $scope.reductionApplied = parseFloat(order.reduction) > 0;
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
                      id: row.id,
                      label: getProductLabel(result.product, selectedVariant),
                      quantity : row.quantity,
                      newQuantity: row.quantity,
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

    $scope.checkSubmitRow = function() {
      var found = $scope.orderRows.filter(function(row) {
        return row.productId === $scope.addProductForm.selectedProduct && row.variantId === $scope.addProductForm.selectedVariantIdForProduct;
      })
      return found.length > 0;
    };

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
        date: $scope.invoiceForm.invoiceDate ? new Date($scope.invoiceForm.invoiceDate).toLocaleDateString("fr-FR").toString() : 
          new Date().toLocaleDateString("fr-FR").toString()
      };
      RestService.post('orders/' + $scope.order.id + '/invoice', data)
        .then(function(response) {
          var fileUrl = SERVER_URL + '/static/invoices/' + response.data.filename;
          $window.open(fileUrl, '_blank');
        });
    };

    $scope.getDeliveryInvoice = function () {
      var data = {
        mf: $scope.invoiceForm.clientMF,
        date: $scope.invoiceForm.deliveryInvoiceDate ? new Date($scope.invoiceForm.deliveryInvoiceDate).toLocaleDateString("fr-FR").toString() : 
          new Date().toLocaleDateString("fr-FR").toString()
      };
      RestService.post('orders/' + $scope.order.id + '/deliveryInvoice', data)
        .then(function(response) {
          var fileUrl = SERVER_URL + '/static/invoices/' + response.data.filename;
          $window.open(fileUrl, '_blank');
        });
    };

    $scope.getCreditInvoice = function () {
      var data = {
        mf: $scope.invoiceForm.clientMF,
        date: $scope.invoiceForm.creditInvoiceDate ? new Date($scope.invoiceForm.creditInvoiceDate).toLocaleDateString("fr-FR").toString() : 
          new Date().toLocaleDateString("fr-FR").toString()
      };
      RestService.post('orders/' + $scope.order.id + '/creditInvoice', data)
        .then(function(response) {
          var fileUrl = SERVER_URL + '/static/invoices/' + response.data.filename;
          $window.open(fileUrl, '_blank');
        });
    };

    $scope.rowQuantityChange = function () {
      var changed = false;
      $scope.rows.forEach(function(row) {
        if (row.quantity !== row.newQuantity) {
          changed = true;
        }
      });
      $scope.rowQuantityChanged = changed;
    };

    $scope.update = function () {
      var changedRows = $scope.rows.filter(function(row) {
        return row.quantity !== row.newQuantity; 
      });
      if (changedRows.length) {
        var promises = changedRows.map(function (row) {
          return OrderRowsService.updateRowQuantity(row.id, row.newQuantity);
        });
        $q.all(promises).then(function () {
          $window.location.reload();
        }, function (error) {

        });
      }
    };

    $scope.removeRow = function(row) {
      OrderRowsService.remove(row.id)
        .then(function () {
          $window.location.reload();
        }, function (error) {

        });
    };

    $scope.addRow = function() {
      $scope.addInProgress = true;
    };

    $scope.cancelAddRow = function() {
      $scope.addInProgress = false;
    };

    $scope.applyReduction = function () {
      OrdersService.applyReduction($scope.order.id, $scope.order.reduction)
        .then(function() {
          $window.location.reload();
        }, function (error) {

        });
    };

    $scope.cancelReduction = function () {
      OrdersService.cancelReduction($scope.order.id)
        .then(function() {
          $window.location.reload();
        }, function (error) {

        });
    };

}]);