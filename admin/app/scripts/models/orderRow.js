'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OrderRow = function OrderRow(data) {
  _classCallCheck(this, OrderRow);

    this.id = data.id;
    this.orderId = data.order_id;
    this.productId = data.product_id;
    this.variantId = data.variant_id;
    this.quantity = data.quantity;
    this.price = data.price;
    this.originalPrice = data.original_price;
};