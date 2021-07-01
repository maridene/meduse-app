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

function formatDate (input) {
  if (!input) {
    return "-";
  }
  var datePart = input.match(/\d+/g),
  year = datePart[0], // get only two digits
  month = datePart[1], day = datePart[2];

  return (+day + 1) +'/'+month+'/'+year;
}

function formatDateTime(input) {
  if (!input) {
    return '';
  }
  const date = formatDate(input.split('T')[0]);
  const time = input.split('T')[1].split('.')[0];
  return "".concat(date, ' - ').concat(time);
}

function getDateFromDatetime(input) {
  const date = formatDateTime(input).split('-')[0];
  if (date) {
    const toDateObject = new Date(date);
    toDateObject.setDate(toDateObject.getDate()+1);
    return toDateObject.toLocaleDateString();
  }
  return date;
}

function orderStatusMapper(status) {
  switch (status) {
    case 'new':
      return 'Nouvelle commande';
    case 'in_progress':
      return 'En cours de traitement';
    case 'confirmed':
      return 'Commande confirmée';
    case 'shipping':
      return 'En cours de livraison';
    case 'canceled':
      return 'Commande annulée';
    case 'shipped':
      return 'Commande livrée';
  }
}

function paymentStatusMapper(status) {
  if (status === 0) {
    return 'Non Payée';
  } else {
    return 'Payée'
  }
}

function ptypeMapper(type) {
  if (type === 'c') {
    return 'Chèque';
  } else {
    return 'Espéces';
  }
}

var newOrder = {key:'new', label:'Nouvelle commande'};
var confirmedOrder = {key:'confirmed', label:'Commande confirmée'};
var canceledOrder = {key:'canceled', label:'Commande annulée'};
var inProgressOrder = {key:'in_progress', label:'Commande En cours de traitement'};
var shippingOrder = {key:'shipping', label:'En cours de livraison'};
var shippedOrder = {key:'shipped', label:'Commande livrée'};

function getPossibleNextStatuses(status) {
  switch (status) {
    case 'new':
      return [newOrder, confirmedOrder, canceledOrder];
    case 'in_progress':
      return [inProgressOrder, shippingOrder, canceledOrder];
    case 'confirmed':
      return [confirmedOrder, inProgressOrder, canceledOrder];
    case 'shipping':
      return [shippedOrder, canceledOrder];
    case 'canceled':
      return [canceledOrder, confirmedOrder];
    case 'shipped':
      return [shippedOrder, confirmedOrder, canceledOrder];
  }
}

function getStatusObjectFromKey(key) {
  switch (key) {
    case 'new':
      return newOrder;
    case 'in_progress':
      return inProgressOrder;
    case 'confirmed':
      return confirmedOrder;
    case 'shipping':
      return shippingOrder;
    case 'canceled':
      return canceledOrder;
    case 'shipped':
      return shippedOrder;
  }
}

function checkPhoneNumber (s) {
  if (!s || !s.length) {
    return false;
  }
  var str = s.replace(/\s+/g, '');
  if (str.length === 0) {
    return false;
  }

  str = str.replace(/\+/g, '');
  return !isNaN(str) && (str.length === 8 || str.length === 11); 
}

var checkZipCode = function (zipcode) {
  return !isNaN(zipcode) && parseInt(zipcode) > 999 && parseInt(zipcode) < 10000;
};

function showModal(title, message) {
  var dlgModal = angular.element('#adminModal');
  if (dlgModal) {
    var titleElement = document.getElementById("adminModalTitle");
    var messageElement = document.getElementById("adminModalMessage");
    titleElement.innerHTML = title;
    messageElement.innerHTML = message;
    dlgModal.modal("show");
  }
}
