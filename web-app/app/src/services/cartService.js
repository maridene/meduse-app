import Cart from '../models/cart';
import CartRow from '../models/cartRow';

export default class CartService {
  constructor(AuthenticationService, $rootScope, ToastService) {
    'ngInject';

    this.$rootScope = $rootScope;
    this.AuthenticationService = AuthenticationService;
    this.ToastService = ToastService;
  }

  init() {
    let cart = this.getCart();
    if (!cart) {
        cart = new Cart([], 0, null, null);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    console.log('cart initialized');
    console.log(cart);
  }

  getCart() {
      return JSON.parse(localStorage.getItem('cart'));
  }

  storeCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  addItemToCart(product, count) {
    if (this.AuthenticationService.isAuthenticated()) {

    } else {
        let cart = this.getCart();
        if (cart) {
            //cart with items
            if (cart.items.length) {
                const cartRowArray = cart.items.filter((item) => item.product.label === product.label);
                if (cartRowArray.length) {
                    const cartRow = cartRowArray[0];
                    cartRow.quantity = cartRow.quantity + 1;
                    cartRow.subTotal = parseFloat(cartRow.subTotal) + parseFloat(cartRow.product.price);
                    this.updateCartRowAndStore(cart, cartRow);
                } else {
                  this.updateCartRowAndStore(cart, new CartRow(product, 1, product.price));
                }
            }
            //empty cart 
            else {
                this.updateCartRowAndStore(cart, new CartRow(product, 1, product.price));
            }

        }
    }
  }

  removeItemFromCart() {

  }

  clearCart() {
      localStorage.removeItem('cart');
  }

  updateCartRowAndStore(cart, cartRow) {
    const index = cart.items.findIndex((item) => item.product.label === cartRow.product.label);
    if (index !== -1) {
      cart.items[index] = cartRow;
    } else {
      cart.items.push(cartRow);
    }
    cart.lastModification = new Date();
    cart.total = cart.items.reduce((acc, cur) => acc + parseFloat(cur.subTotal), 0);
    this.clearCart();
    this.storeCart(cart);
    this.ToastService.showSimpleToast('Produit ajouté au panier');
    this.$rootScope.$broadcast('cartUpdated');
  }
}
