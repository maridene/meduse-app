'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User(data) {
  _classCallCheck(this, User);

  this.id = data.id;
  this.name = data.name;
  this.email = data.email;
  this.phone = data.phone;
  this.phone2 = data.phone2;
  this.token = data.token;
  this.creationDate = data.creationDate ? formatDateTime(data.creationDate).split('-')[0] : '';
  this.role = data.role;
  this.premium = data.premium;
  this.points = data.points;
  this.mf = data.mf;
};