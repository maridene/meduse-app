'use strict';

class Cart {
  constructor(items, total, lastModification, username) {
    this.items = items;
    this.total = total;
    this.lastModification = lastModification;
    this.username = username;
  }
}

export default Cart;