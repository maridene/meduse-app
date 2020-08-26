class CartCtrl {
    constructor(AppConstants, CartService) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.CartService = CartService;

      this.cart = this.CartService.getCart();
      this.cartItems = this.cart.items;
      
      this.update();
    }

    update() {
      this.total = this.cartItems.reduce((acc, cur) => acc + cur.product.price * cur.quantity, 0);
      console.log(this.total);
    }
  
  }
  
  export default CartCtrl;