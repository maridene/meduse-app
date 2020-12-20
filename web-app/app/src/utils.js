export function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

export function unit8ArrayToBase64(data) {
    return btoa(
        new Uint8Array(data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
}

export function getImageFromBuffer(data) {
    return 'data:image/jpg;base64,' + unit8ArrayToBase64(data);
}

export function getImageUrlFromProduct(baseUrl, product) {
    return product.imgCount ? `${baseUrl}images/${product.sku}-1.jpg` : `${baseUrl}images/no-image.jpg`;
}

export function getImagesUrlsFromProduct(baseUrl, product) {
    if (product.imgCount) {
        return Array(product.imgCount).fill(`${baseUrl}images/${product.sku}`).map((item, index) => `${item}-${index+1}.jpg`);
    } else {
        return [`${baseUrl}images/no-image.jpg`];
    }
}

function formatDateTime(input) {
    const date = formatDate(input.split('T')[0]);
    const time = input.split('T')[1].split('.')[0];
    return "".concat(date, ' - ').concat(time);
}

function getDateFromDatetime(input) {
    return formatDateTime(input).split('-')[0];
}

function formatDate (input) {
    var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[1], day = datePart[2];
  
    return day+'/'+month+'/'+year;
}

export function EnrichOrder(order) {
    order.paymentType = order.ptype === 'e' ? 'Espèces' : 'Chéque';
    order.status = orderStatusMapper(order.order_status);
    order.paymentStatus = order.payment_status === 0 ? 'Payée' : 'Non payée';
    order.date = formatDateTime(order.order_date);
    return order;
}

export function orderStatusMapper(status) {
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

export function orderSorterByDateDESC(o1, o2) {
    if (o1 < o2) {
        return -1;
    } else if (o1 > o2) {
        return 1;
    } else {
        return 0;
    }
}

export function orderSorterByStatusASC(o1, o2) {
    const statusIndex = [
        'new',
        'confirmed',
        'in_progress',
        'shipping',
        'shipped',
        'canceled'
    ];
    if (statusIndex.indexOf(o1.order_status) > statusIndex.indexOf(o2.order_status)) {
        return 1;
    } else if (statusIndex.indexOf(o1.order_status) < statusIndex.indexOf(o2.order_status)) {
        return -1;
    } else {
        return 0;
    }
}
