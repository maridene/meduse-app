'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Address = function Address(data) {
  _classCallCheck(this, Address);

  this.id = data.id;
  this.name = data.name;
  this.userId = data.userId;
  this.city = data.city;
  this.state = data.state;
  this.address = data.address;
  this.description = data.description;
  this.zipcode = data.zipcode;
  this.phone = data.phone;
};