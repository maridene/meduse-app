class CheckoutCtrl {
    constructor($scope, $location, $timeout, AppConstants, CartService, AddressesService, CouponsService, OrdersService, AuthenticationService, shippingSettings) {
      'ngInject';
  
      this.$scope = $scope;
      this.$location = $location;
      this.$timeout = $timeout;
      this.appName = AppConstants.appName;
      this.CartService = CartService;
      this.AddressesService = AddressesService;
      this.CouponsService = CouponsService;
      this.OrdersService = OrdersService;
      this.AuthenticationService = AuthenticationService;
      this.shippingSettings = shippingSettings;

      this.form = {
        useSameAddress: false,
        cash: true,
        check: false
      };
      this.canApplyCoupon = true;
    }

    $onInit() {
      //this.initaddressChooser();
      this.reloadCart();
      this.$scope.$on('cartUpdated', () => {
        this.reloadCart();
      });
      this.getMyAddresses();
      this.$scope.$watch(() => this.form.code, () => {
        this.form.couponUnvalid = false;
        this.form.couponValid = false;
      }, true);
    }

    reloadCart() {
      this.cart = this.CartService.getCart();
      this.canApplyCoupon = this.cart.getTotal() <= 1000;
      this.cartItems = this.cart.items.map((cartItem) => {
        let label = cartItem.product.label;
        if (cartItem.variant) {
          if (cartItem.variant.color && cartItem.variant.color !== '') {
            label = `${label} - ${cartItem.variant.color}`;
          }
          if (cartItem.variant.size && cartItem.variant.size !== '') {
            label = `${label} - ${cartItem.variant.size}`;
          }
        }
        return {
          label,
          quantity: cartItem.quantity,
          subTotal: cartItem.getSubTotal()
        }
      });
      this.setPoints();
      this.setTotal();
    }

    setPoints() {
      this.points = Math.floor(this.cart.getTotal());
    }
    
    getMyAddresses() {
      this.AddressesService.getMyAddresses()
        .then((result) => {
          if (result && result.length) {
            this.myAddresses = result;
            this.form.selectedDeliveryAddress = this.myAddresses[0];
            this.form.selectedBillingAddress = this.myAddresses[0];
          }
          
        });
    }

    submitOrder() {
      if (this.canSubmit()) {
        const orderDetails = {
          message: this.form.message || '',
          delivery_address: this.form.selectedDeliveryAddress.address,
          delivery_zipcode: this.form.selectedDeliveryAddress.zipcode,
          delivery_state: this.form.selectedDeliveryAddress.state,
          delivery_city: this.form.selectedDeliveryAddress.city,
          delivery_phone: this.form.selectedDeliveryAddress.phone,
          billing_address: this.form.useSameAddress ? this.form.selectedDeliveryAddress.address : this.form.selectedBillingAddress.address,
          billing_zipcode: this.form.useSameAddress ? this.form.selectedDeliveryAddress.zipcode : this.form.selectedBillingAddress.zipcode,
          billing_state: this.form.useSameAddress ? this.form.selectedDeliveryAddress.state : this.form.selectedBillingAddress.state,
          billing_city: this.form.useSameAddress ? this.form.selectedDeliveryAddress.city : this.form.selectedBillingAddress.city,
          billing_phone: this.form.useSameAddress ? this.form.selectedDeliveryAddress.phone : this.form.selectedBillingAddress.phone,
          ptype: this.form.cash ? 'e' : 'c'
        };
  
        if (this.coupon) {
          orderDetails.coupon_id = this.coupon.id;
        }
  
        const orderRows = this.cart.items.map((item) => ({
          productId: item.product.id,
          variantId: item.variant ? item.variant.id: null,
          quantity: item.quantity
        }));
  
        orderDetails.orderRows = orderRows.map((row) => JSON.stringify(row)).join(';');
  
        this.OrdersService.submitOrder(orderDetails)
          .then(() => {
            this.CartService.clearCart();
            this.$location.path('#');
          });
      } else {
        window.scrollTo(0, 0);
        this.showAddressNeededMessage = true;
        this.$timeout(() => {
          this.showAddressNeededMessage = false;
        }, 3000);
      }
    }

    checkCode() {
      this.CouponsService.checkCoupon(this.form.code)
        .then((coupon) => {
          this.coupon = coupon.data;
          this.form.couponValid = true;
          this.form.couponUnvalid = false;
          this.setTotal();
        }, (error) => {
          this.coupon = null;
          this.form.couponValid = false;
          this.form.couponUnvalid = true;
          this.setTotal();
        });
    }

    setTotal() {
      const cartTotal = this.coupon && this.coupon.value ? this.CartService.getCartTotalWithReduction(this.cart, this.coupon.value) 
      : this.cart.getTotal();
      if (this.shippingSettings.free === "1" || this.AuthenticationService.isPremium()) {
        this.shippingFee = 0;
      } else {
        this.shippingFee = this.cart.getTotal() >= parseFloat(this.shippingSettings.freeFrom) ? 0 : parseFloat(this.shippingSettings.shippingFee);      
      }
        this.total = cartTotal + this.shippingFee;
    }

    cancelCode() {
      this.form.code = '';
      this.coupon = null;
      this.form.couponValid = false;
      this.totalWithReduction = null;
      this.setTotal();
    }

    canSubmit() {
      return this.form.selectedDeliveryAddress && (this.form.useSameAddress || this.form.selectedBillingAddress) && this.cartItems.length;
    }

    ptypeChanged(which) {
      if (which === 'cash') {
        this.form.check = !this.form.check;
      } else {
        this.form.cash = !this.form.cash;
      }
    }
  }
  
  export default CheckoutCtrl;