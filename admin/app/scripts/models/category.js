'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Category = function Category(data) {
  _classCallCheck(this, Category);

  this.id = data.id;
  this.label = data.label;
  this.description = data.description;
  this.productsCount = data.productscount;
};