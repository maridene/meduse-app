'use strict';

class CartRow {
  constructor(product, quantity, subTotal) {
    this.product = product;
    this.quantity = quantity;
    this.subTotal = subTotal;
  }
}

export default CartRow;