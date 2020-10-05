"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function storageAvailable(type) {
  var storage;

  try {
    storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return _instanceof(e, DOMException) && ( // everything except Firefox
    e.code === 22 || // Firefox
    e.code === 1014 || // test name field too, because code might not be present
    // everything except Firefox
    e.name === 'QuotaExceededError' || // Firefox
    e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // acknowledge QuotaExceededError only if there's something already stored
    storage && storage.length !== 0;
  }
}

function getImageUrlFromProduct(baseUrl, product) {
  return product.imgCount ? "".concat(baseUrl, "images/").concat(product.sku, "-1.jpg") : "".concat(baseUrl, "images/no-image.jpg");
}

function getImagesUrlsFromProduct(baseUrl, product) {
  if (product.imgCount) {
    return Array(product.imgCount).fill("".concat(baseUrl, "images/").concat(product.sku)).map(function (item, index) {
      return "".concat(item, "-").concat(index + 1, ".jpg");
    });
  } else {
    return ["".concat(baseUrl, "images/no-image.jpg")];
  }
}

function isBlank(str) {
  return !str || /^\s*$/.test(str);
}

function skuFromProductLabel(value) {
  return value.split(' ').map(function (part) {
    if (part.length < 3) {
      return '';
    } else {
      return part.substring(0, 3);
    }
  }).filter(function (part) {
    return part !== '';
  }).join('-');
}

function dashStr(str) {
  return str.replace(/\s+/g, '-').toLowerCase();
}

function getProductSKU(category, marque, label) {
  return "".concat(dashStr(category), "-").concat(dashStr(marque), "-").concat(skuFromProductLabel(label));
}