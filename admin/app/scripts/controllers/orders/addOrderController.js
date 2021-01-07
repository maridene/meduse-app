'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddOrderCtrl
 * @description
 * # MainCtrl
 * Controller of the add order page
 */

angular.module('sbAdminApp').controller('AddOrderCtrl', 
['$scope', '$stateParams', 'OrdersService', 'UsersService', 'CategoryService', 'ProductService', 'ProductVariantsService', 
function ($scope, $stateParams, OrdersService, UsersService, CategoryService, ProductService, ProductVariantsService) {
  $scope.client = {};
  $scope.clientAddresses = [];
  $scope.rows = [];
  $scope.form = {
    useNewAddress: '1',
    newAddress : {},
    ptype: 'e',
    message: ''
  };
  $scope.addProductForm = {
    selectedCategoryId: null,
    productsForCategory : [],
    selectedProduct: null,
    variantsForProduct : [],
    selectedVariantIdForProduct: null
  };
  $scope.addInProgress = false;

  $scope.modal = {
    errorMessage: ''
  };

  $scope.states = [
    'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef',
    'Mahdia', 'La Manouba', 'Mèdenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 
    'Touzeur', 'Tunis', 'Zaghouan'];

  $scope.init = function () {
    UsersService.getById($stateParams.clientId)
      .then(function(result) {
        $scope.client = result;
        if ($scope.client) {
          UsersService.getUserAddresses($scope.client.id)
            .then(function(addresses) {
              $scope.clientAddresses = addresses;
              if ($scope.clientAddresses.length) {
                $scope.clientAddresses[0].isSelected = true;
              }
            }, function(err) {
              showModal('#errorModal');
              console.error(err);
            });
        } else {
          showModal('#errorModal');
        }
      },function (err) {
        showModal('#errorModal');
      });

      CategoryService.getAllCategories().then(function(result) {
        if (result.length) {
          $scope.categories = result;
          $scope.addProductForm.selectedCategoryId = result.length ? result[0].id : null;
        }
      });

      $scope.$watch('addProductForm.selectedCategoryId', function() {
        if ($scope.addProductForm.selectedCategoryId) {
          $scope.addProductForm.productsForCategory = [];
          $scope.addProductForm.selectedProduct = null;
          $scope.addProductForm.variantsForProduct = [];
          $scope.addProductForm.selectedVariantIdForProduct = null;
  
          ProductService.getProductsByCategory($scope.addProductForm.selectedCategoryId)
            .then(function(productsForCategory) {
              if (productsForCategory.items.length) {
                $scope.addProductForm.productsForCategory = productsForCategory.items;
                $scope.addProductForm.selectedProduct = productsForCategory.items[0];
              }
            });
        }
      });
  
      $scope.$watch('addProductForm.selectedProduct.id', function() {
        if ($scope.addProductForm.selectedProduct) {
          $scope.addProductForm.variantsForProduct = [];
          $scope.addProductForm.selectedVariantIdForProduct = null;
          
          ProductVariantsService.getByProductId($scope.addProductForm.selectedProduct.id)
          .then(function(variants) {
            if (variants && variants.length) {
              $scope.addProductForm.variantsForProduct = variants;
              $scope.addProductForm.selectedVariantIdForProduct = variants[0].id;
            }
          });
        }
      });
  };

  $scope.addressSelected = function(address) {
    $scope.clientAddresses.forEach(function(address) {
      address.isSelected = false;
    });
    address.isSelected = true;
  };

  $scope.init();
  
  $scope.confirmRow = function() {
    if ($scope.checkSubmitRow()) {

    } else {
      var foundVariants = $scope.addProductForm.variantsForProduct.filter(function(each) {
        return '' + each.id === '' + $scope.addProductForm.selectedVariantIdForProduct;
      });
      var variant= foundVariants.length ? foundVariants[0] : null;

      var data = {
        product: $scope.addProductForm.selectedProduct,
        variant: variant,
        quantity: 1,
        variantLabel: variant ? buildVariantLabel(variant) : ''
      };
      $scope.rows.push(data);
    }
  };

  $scope.addRow = function() {
    $scope.addInProgress = true;
  };

  $scope.cancelAddRow = function() {
    $scope.addInProgress = false;
  };

  $scope.removeRow = function(index) {
    $scope.rows.splice(index, 1);
  };

  $scope.checkSubmitRow = function() {
    var found = $scope.rows.filter(function(each) {
      return each.product.id === $scope.addProductForm.selectedProduct.id 
        && (
          (!each.variant || $scope.addProductForm.selectedVariantIdForProduct === null) 
          || (each.variant && $scope.addProductForm.selectedVariantIdForProduct !== null && each.variant.id === $scope.addProductForm.selectedVariantIdForProduct)
        );
    });
    return found.length > 0;
  };

  var buildVariantLabel = function(variant) {
    var label = '';
    if (variant.size) {
      label = label + 'Taille: ' + variant.size;
    }
    if (variant.color && variant.size) {
      label = label +  ' - ';
    }
    if (variant.color) {
      label = label + 'Couleur: ' + variant.color;
    }
    return label;
  };

  var showModal = function showModal(id) {
    var dlgElem = angular.element(id);

    if (dlgElem) {
      dlgElem.modal("show");
    }
  };

  var getDeliveryAddress = function() {
    if ($scope.form.useNewAddress === '1') {
      return {
        delivery_address: $scope.form.newAddress.address,
        delivery_zipcode: $scope.form.newAddress.zipcode,
        delivery_state: $scope.form.newAddress.state,
        delivery_city: $scope.form.newAddress.city,
        delivery_phone: $scope.form.newAddress.phone,
        billing_address: $scope.form.newAddress.address,
        billing_zipcode: $scope.form.newAddress.zipcode,
        billing_state: $scope.form.newAddress.state,
        billing_city: $scope.form.newAddress.city,
        billing_phone: $scope.form.newAddress.phone
      }
    } else {
      var selectedAddress = $scope.clientAddresses.filter(function(each) {
        return each.isSelected;
      });
      if (selectedAddress.length) {
        var address = selectedAddress[0];
        return {
          delivery_address: address.address,
          delivery_zipcode: address.zipcode,
          delivery_state: address.state,
          delivery_city: address.city,
          delivery_phone: address.phone,
          billing_address: address.address,
          billing_zipcode: address.zipcode,
          billing_state: address.state,
          billing_city: address.city,
          billing_phone: address.phone
        }
      }
      return null;
    }
  }

  $scope.addOrder = function() {
    var deliveryAddress = getDeliveryAddress();
    if (canSubmit(deliveryAddress)) {
      var orderDetails = {
        message: $scope.form.message,
        ptype: $scope.form.ptype,
        client_id: $scope.client.id
      };

      orderDetails = Object.assign({}, orderDetails, deliveryAddress);

      var orderRows = $scope.rows.map(function (item) {
        return {
          productId: item.product.id,
          variantId: item.variant ? item.variant.id: null,
          quantity: item.quantity
        };
      });

      orderDetails.orderRows = orderRows.map(function(row){
        return JSON.stringify(row);
      });

      orderDetails.orderRows = orderDetails.orderRows.join(';');

      console.log(orderDetails);
      OrdersService.create(orderDetails)
        .then(function() {
          showModal('#successModal');
          clear();
        }, function(error) {
          $scope.modal.errorMessage = error;
          showModal('#errorModal');
        });
    }
  }

  var canSubmit = function () {
    return true;
  };

  var clear = function () {
    $scope.rows = [];
    $scope.form = {
      useNewAddress: '1',
      newAddress : {},
      ptype: 'e',
      message: ''
    };

    $scope.addInProgress = false;
  
    $scope.modal = {
      errorMessage: ''
    };
  };

}]);
