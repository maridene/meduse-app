'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Product = function Product(data) {
  _classCallCheck(this, Product);

  this.id = data.id;
  this.sku = data.sku;
  this.label = data.label;
  this.description = data.description;
  this.lowStockThreshold = data.lowStockThreshold;
  this.price = data.price;
  this.tva = data.tva;
  this.quantity = data.quantity;
  this.video_link = data.video_link;
  this.category_id = data.category_id;
  this.categoryLabel = data.categoryLabel;
  this.long_description = data.long_description;
  this.promo_price = data.promo_price;
  this.manufacturerId = data.manufacturerId;
  this.manufacturerName = data.manufacturerName;
  this.weight = data.weight;
  this.images = data.images;
  this.tags = data.tags;
  this.creationDate = data.creationDate;
  this.modificationDate = data.modificationDate;
  this.pinned = data.pinned;
};