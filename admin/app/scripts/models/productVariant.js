'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProductVariant = function ProductVariant(data) {
  _classCallCheck(this, ProductVariant);

  this.id = data.id;
  this.sku = data.sku;
  this.product_id = data.product_id;
  this.color = data.color;
  this.size = data.size;
  this.quantity = data.quantity;
  this.imgCount = data.imgCount;
};