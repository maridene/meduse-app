'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Order = function Order(data) {
  _classCallCheck(this, Order);

  this.id = data.id;
  this.userId = data.userId;
  this.userName = data.userName;
  this.total = data.total;
  this.date = data.date;
  this.addressId = data.addressId;
  this.status = data.status;
};