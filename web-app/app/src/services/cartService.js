import Cart from '../models/cart';
import CartRow from '../models/cartRow';

export default class CartService {
  constructor($rootScope, $mdDialog, SettingsService) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    this.SettingsService = SettingsService;
    this.secret = 'Meduse secret for cart crypto';
  }

  init() {
    this.getCart();
  }

  getCart() {
      const encrypted = localStorage.getItem('cart');
      //cart exist but can be altered
      let cart = null;
      if (encrypted && encrypted.length) {
        const bytes  = CryptoJS.AES.decrypt(encrypted, this.secret);
        try {
          cart = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          cart = new Cart(cart.items, cart.lastModification);
          return cart;
        } catch(e) {
          cart = new Cart([], null);
          this.storeCart(cart);
          return cart;
        } 
      } else {
        cart = new Cart([], null);
        this.storeCart(cart);
        return cart;
      }
  }

  storeCart(cart) {
    const encryptedCart = CryptoJS.AES.encrypt(JSON.stringify(cart), this.secret).toString();
    localStorage.setItem('cart', encryptedCart);
    this.$rootScope.$broadcast('cartUpdated');
  }

  addItemToCart(product, count, variant) {
    let cart = this.getCart();
    if (cart) {
      //cart with items
      if (cart.items.length) {
        const cartRowArray = variant ? cart.items.filter((item) => item.variant && item.variant.id === variant.id)
          : cart.items.filter((item) => item.product.id === product.id);
        if (cartRowArray.length) {
          const cartRow = cartRowArray[0];
          cartRow.quantity = cartRow.quantity + count;
          this.updateCartRowAndStore(cart, cartRow);
        } else {
          this.updateCartRowAndStore(cart, new CartRow(product, variant, count));
        }
      }
      //empty cart 
      else {
        this.updateCartRowAndStore(cart, new CartRow(product, variant, count));
      }

      this.showDialog(product, count, variant);
    }
  }

  updateCartRowQuantity(row) {
    let cart = this.getCart(); 
    if (cart && cart.items && cart.items.length) {
      const cartRowArray = row.variant ? cart.items.filter((item) => item.variant && item.variant.id === row.variant.id)
          : cart.items.filter((item) => item.product.id === row.product.id);
      if (cartRowArray.length) {
        const cartRow = cartRowArray[0];
        cartRow.quantity = row.quantity;
        this.updateCartRowAndStore(cart, cartRow);
      }
    }
  }

  removeItem(product, variant) {
    let cart = this.getCart();
    if (cart) {
      if (variant) {
        cart.items = cart.items.filter((item) => !(item.variant && item.variant.id === variant.id));
      } else {
        cart.items = cart.items.filter((item) => item.product.id !== product.id);
      }
      this.storeCart(cart);
    }
  }

  getCartTotalWithReduction(cart, reduction) {
    if (cart && reduction && reduction.length > 1) {
      const value = parseInt(reduction.split('%')[0]);
      const coef = value/100;
      return cart.getTotal() * coef;
    } else {
      return cart.getTotal();
    }
  }

  clearCart() {
      localStorage.removeItem('cart');
      this.$rootScope.$broadcast('cartUpdated');
  }

  updateCartRowAndStore(cart, cartRow) {
    let index;
    if (cartRow.variant) {
      index = cart.items.findIndex((item) => item.variant && item.variant.id === cartRow.variant.id);
    } else {
      index = cart.items.findIndex((item) => item.product.id === cartRow.product.id);
    }

    if (index !== -1) {
      cart.items[index] = cartRow;
    } else {
      cart.items.push(cartRow);
    }
    cart.lastModification = new Date();
    this.clearCart();
    this.storeCart(cart);
  }

  showDialog(product, count, variant) {
    const cart = this.getCart();
    this.SettingsService.getShippingSettings()
      .then((shippingData) => {
        this.$mdDialog.show({
          locals: {data: {product, count, variant, cart, shippingData}},
          templateUrl: 'cart/cart-dialog.html',
          parent: angular.element(document.body),
          targetEvent: event,
          clickOutsideToClose: true,
          fullscreen: false,
          controller: ['AppConstants', 'CartService', 'AuthenticationService', '$scope', '$mdDialog', '$location', 'data', 
          (AppConstants, CartService, AuthenticationService, $scope, $mdDialog, $location, data) => {
    
            $scope.close = function () {
              $mdDialog.hide();
            };
    
            $scope.goToCart = function() {
              $mdDialog.hide();
              $location.path('/cart');
            };
    
            $scope.product = data.product;
            $scope.image = $scope.product.images && $scope.product.images.length ? 
            `${AppConstants.productsStaticContentUrl}${$scope.product.images.split(',')[0]}` : null;
            $scope.count = data.count;
            $scope.cart = CartService.getCart();
            $scope.productsInCart = cart.items.length;
            let shippingFee ;
            if (data.shippingData.free === "1" || AuthenticationService.isPremium() || cart.getTotal() >= parseFloat(data.shippingData.freeFrom)) {
              shippingFee = 0;
              $scope.shipment = 'Livraison gratuite !';
            } else {
              shippingFee = parseFloat(data.shippingData.shippingFee);      
              $scope.shipment = `${shippingFee} D.T`;
            }
            $scope.cartTotal = cart.getTotal();
            $scope.total = cart.getTotal() + shippingFee;
          }]
        });
      })
  }
}
