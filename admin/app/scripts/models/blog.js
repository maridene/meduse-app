'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blog = function Blog(data) {
  _classCallCheck(this, Blog);

  this.id = data.id;
  this.title = data.title;
  this.description = data.description;
  this.date = data.date;
  this.videolink = data.videolink;
  this.imagelink = data.imagelink;
};