'use strict';

class CartRow {
  constructor(product, variant, quantity) {
    this.product = product;
    this.variant = variant;
    this.quantity = quantity;
  }

  getSubTotal() {
    return this.product.promo_price ? parseFloat(this.product.promo_price) * this.quantity
      : parseFloat(this.product.price) * this.quantity;
  }
}

export default CartRow;