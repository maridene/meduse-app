'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User(data) {
  _classCallCheck(this, User);

  this.id = data.id;
  this.name = data.name;
  this.email = data.email;
  this.phone = data.phone;
  this.token = data.token;
  this.creationDate = data.creationDate;
  this.role = data.role;
};