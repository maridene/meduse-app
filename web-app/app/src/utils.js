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