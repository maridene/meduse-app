const addresses = require('./addresses.model');

module.exports = {
    getById,
    getByUserId,
    add,
    updateById,
    remove
};

function getById(id) {
    return new Promise((resolve, reject) => {
        addresses.getById(id)
            .then((address) => {
                resolve(address);
            }, (error) => {
                reject(err);
            })
    });
}

function getByUserId(userId) {
    return new Promise((resolve, reject) => {
        addresses.getByUserId(userId)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function add({ userId, name, city, state, avenue, description, zipcode, phone }) {
    return new Promise((resolve, reject) => {
        addresses.add({ userId, name, city, state, avenue, description, zipcode, phone })
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function updateById() {
    return new Promise((resolve, reject) => {
        
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        addresses.remove(id)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            });
    });
}