'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manufacturer = function Manufacturer(data) {
  _classCallCheck(this, Manufacturer);

  this.id = data.id;
  this.name = data.name;
  this.webSite = data.website;
  this.productsCount = data.productscount;
};