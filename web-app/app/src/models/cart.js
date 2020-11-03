'use strict';

import CartRow from "./cartRow";
import { curry } from "angular-ui-router";

class Cart {
  constructor(items, lastModification) {
    this.items = items.map((item) => new CartRow(item.product, item.variant, item.quantity));
    this.lastModification = lastModification;
  }

  getTotal() {
    return this.items.reduce((acc, cur) => acc + parseFloat(cur.getSubTotal()), 0);
  }
}

export default Cart;