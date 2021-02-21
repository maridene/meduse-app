'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function Client(data) {
  _classCallCheck(this, Client);

  this.id = data.id;
  this.prefix = data.prefix;
  this.name = data.name;
  this.email = data.email;
  this.phone = data.phone;
  this.premium = !!data.premium;
  this.points = data.points;
  this.signupDate = data.creationDate ? formatDate(data.creationDate) : '-';
  this.mf = data.mf;
};