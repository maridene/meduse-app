'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:AddOrderCtrl
 * @description
 * # MainCtrl
 * Controller of the add order page
 */

angular.module('sbAdminApp').controller('AddOrderCtrl', 
['$scope', '$q', '$stateParams', 'OrdersService', 'UsersService', 'CategoryService', 'ProductService', 'ProductVariantsService', 'ModalService', 'AddressService',
function ($scope, $q, $stateParams, OrdersService, UsersService, CategoryService, ProductService, ProductVariantsService, ModalService, AddressService) {

  $scope.client = {};
  $scope.clientAddresses = [];
  $scope.rows = [];
  $scope.form = {
    useNewAddress: '1',
    saveNewAddress: '0',
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
    errorMessage: '',
    warningMessage: ''
  };

  $scope.states = STATES;

  $scope.init = function () {
    UsersService.getById($stateParams.clientId)
      .then(function(result) {
        if (result) {
          $scope.client = result;
          $scope.form.newAddress.phone = $scope.client.phone;
          UsersService.getUserAddresses($scope.client.id)
            .then(function(addresses) {
              if (addresses && addresses.length) {
                $scope.clientAddresses = addresses;
                $scope.clientAddresses[0].isSelected = true;
              }
            }, function(err) {
              ModalService.showErrorModal(err);
            });
        } else {
          ModalService.showErrorModal("Client introuvable!");
        }
      },function (err) {
        ModalService.showErrorModal(err);
      });

      CategoryService.getAllCategories().then(function(result) {
        if (result && result.length) {
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
    if ($scope.canSubmitRow()) {
      var foundVariants = $scope.addProductForm.variantsForProduct.filter(function(each) {
        return '' + each.id === '' + $scope.addProductForm.selectedVariantIdForProduct;
      });
      var variant= foundVariants.length ? foundVariants[0] : null;

      var data = {
        product: $scope.addProductForm.selectedProduct,
        variant: variant,
        quantity: 1,
        variantLabel: variant ? buildVariantLabel(variant) : '',
        reduction: 0
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

  $scope.canSubmitRow = function() {
    var found = $scope.rows.filter(function(each) {
      return each.product.id === $scope.addProductForm.selectedProduct.id 
        && (
          (!each.variant || $scope.addProductForm.selectedVariantIdForProduct === null) 
          || (each.variant && $scope.addProductForm.selectedVariantIdForProduct !== null && each.variant.id === $scope.addProductForm.selectedVariantIdForProduct)
        );
    });
    return !found.length;
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
    if (hasRows()) {
      if (addressChoosen()) {
        if (validateAddress()) {
          var deliveryAddress = getDeliveryAddress();
          var orderDetails = {
            message: $scope.form.message,
            ptype: $scope.form.ptype,
            client_id: $scope.client.id
          };
          orderDetails = Object.assign( {}, orderDetails, deliveryAddress);

          var orderRows = $scope.rows.map(function (item) {
            return {
              productId: item.product.id,
              variantId: item.variant ? item.variant.id: null,
              quantity: item.quantity,
              reduction: item.reduction
            };
          })
          .map(function(row){
            return JSON.stringify(row);
          }).join(';');

          orderDetails.orderRows = orderRows;

          var preAddOrderPromise = $q.when();

          if ($scope.form.useNewAddress === "1" && $scope.form.saveNewAddress) {
            var addressToAdd = {
                userId: $scope.client.id,
                name: $scope.form.newAddress.name,
                city: $scope.form.newAddress.city,
                state: $scope.form.newAddress.state,
                address: $scope.form.newAddress.address,
                description: '',
                zipcode: $scope.form.newAddress.zipcode,
                phone: $scope.form.newAddress.phone
            };
            preAddOrderPromise = AddressService.add(addressToAdd);
          }

          preAddOrderPromise.then(function() {
            OrdersService.create(orderDetails)
            .then(function() {
              ModalService.showCustomModal(ADD_ORDER_SUCCESS_TITLE, ADD_ORDER_SUCCESS_MESSAGE);
              clear();
            }, function(error) {
              ModalService.showErrorModal(error.data.message);
            });
          }, function(error) {
            ModalService.showErrorModal(error.data.message);
          });
        }
      } else {
        ModalService.showWarningModal(NO_ADDRESS_MESSAGE);
      }
    } else {
      ModalService.showWarningModal(NO_ROW_MESSAGE);
    }
  }

  var addressChoosen = function () {
    if ($scope.form.useNewAddress === "1") {
      return !isBlank($scope.form.newAddress.address) 
      && !isBlank($scope.form.newAddress.zipcode) 
      && !isBlank($scope.form.newAddress.state) 
      && !isBlank($scope.form.newAddress.city) 
      && !isBlank($scope.form.newAddress.phone);
    } else {
      var selectedAddress = $scope.clientAddresses.filter(function(each) {
        return each.isSelected;
      });
      return !!selectedAddress.length;
    }
  };

  var hasRows = function () {
    return $scope.rows && $scope.rows.length;
  };

  var clear = function () {
    $scope.rows = [];
    $scope.form = {
      useNewAddress: '1',
      saveNewAddress: '0',
      newAddress : {},
      ptype: 'e',
      message: ''
    };

    $scope.addInProgress = false;
  
    $scope.modal = {
      errorMessage: '',
      warningMessage: ''
    };
  };

  var validateAddress = function() {
    if ($scope.form.useNewAddress === "1") {
      if (!checkZipCode($scope.form.newAddress.zipcode)) {
        ModalService.showWarningModal(VERIFY_ZIPCODE);
        return false;
      }
      if (!checkPhoneNumber($scope.form.newAddress.phone)) {
        ModalService.showWarningModal(VERIFY_PHONE);
        return false;
      }
      if (isBlank($scope.form.newAddress.name)) {
        ModalService.showWarningModal(EMPTY_ADDRESS_TITLE);
        return false;
      }
    }
    return true;
  };

}]);
