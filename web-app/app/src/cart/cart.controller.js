class CartCtrl {
    constructor(AppConstants, CartService, AuthenticationService, $timeout, $scope, $location) {
      'ngInject';
  
      this.AppConstants = AppConstants;
      this.CartService = CartService;
      this.AuthenticationService = AuthenticationService;
      this.$timeout = $timeout;
      this.$scope = $scope;
      this.$location = $location;

      this.reloadCart();
      this.update();
    }

    update() {
      this.total = this.cart.getTotal();
      this.setPoints();
    }

    $onInit() {
      this.$timeout(() => {
        this.initQuantityChooser();
      });

      this.$scope.$on('cartUpdated', () => {
        this.reloadCart();
      });
    }

    initQuantityChooser() {
      const that = this;
      angular.element(document.querySelectorAll('.qtybtn')).remove();

      document.querySelectorAll('.pro-qty').forEach((proQty, index) => {
        const itemQty = angular.element(proQty);
        
        itemQty.prepend('<span class="dec qtybtn">-</span>');
        itemQty.append('<span class="inc qtybtn">+</span>');
        
        itemQty.on('click', '.qtybtn', function () {
          var $button = $(this);
          var oldValue = $button.parent().find('input').val();
          if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
          } else {
            // Don't allow decrementing below 1
            if (oldValue > 1) {
              var newVal = parseFloat(oldValue) - 1;
            } else {
              newVal = 1;
            }
          }
          that.cartItems[index].quantity = newVal;
          that.updateCartRowQuantity(that.cartItems[index]);

          $button.parent().find('input').val(newVal);
        });
      });
    }

    updateCartRowQuantity(item) {
      console.log(item);
      if (item.quantity && item.quantity % 1 === 0) {
        this.CartService.updateCartRowQuantity(item);
      }
    }

    removeItem(item) {
      if (item) {
        this.CartService.removeItem(item.product, item.variant);
        this.reloadCart();
      }
    }

    reloadCart() {
      this.cart = this.CartService.getCart();
      this.cartItems = this.cart.items.map((item) => {
        item.image = item.product.images && item.product.images.length ? 
        `${this.AppConstants.productsStaticContentUrl}${item.product.images.split(',')[0]}` : null;
        item.subTotal = item.getSubTotal();
        return item;
      });
      this.shippingFee = this.cart.getTotal() >= 50 ? 0 : 7;
      this.$timeout(() => {
        this.initQuantityChooser();
      });
      this.setPoints();
    }

    goToCheckout() {
      if (this.AuthenticationService.isAuthenticated()) {
        this.$location.path('/checkout');
      } else {
        this.$location.path('/login').search({next: 'checkout'});
      }
    }

    setPoints() {
      this.points = Math.floor(this.cart.getTotal());
    }
  
  }
  
  export default CartCtrl;