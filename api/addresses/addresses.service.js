const addresses = require('./addresses.model');
const Address = require('./addresses.model');

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

function add({ userId, name, city, state, address, description, zipcode, phone }) {
    return new Promise((resolve, reject) => {
        addresses.add({ userId, name, city, state, address, description, zipcode, phone })
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

function remove(userId, addressId) {
    return new Promise((resolve, reject) => {
        getById(addressId).then((address) => {
            console.log(address.userId);
            console.log(userId);
            if (address.userId === userId) {
                addresses.remove(addressId)
                    .then((result) => {
                        resolve(result);
                    }, (err) => {
                        reject(error);
                    })
            } else {
                console.error('Authenticated user has no right to delete this address.');
                reject();
            }
        }, (error) => {
            reject(error);
        })
    });
}