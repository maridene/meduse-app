const subscribers = require('./subscriber.model');

module.exports = {
    getAll,
    getById,
    removeById,
    removeByEmail,
    subscribe
};

function getAll() {
    return new Promise((resolve, reject) => {
        subscribers
        .getAll()
        .then((all) => {
            resolve(all);
        }, (err) => {
            reject(err);
        });
    });
}

function removeByEmail(email) {
    return new Promise((resolve, reject) => {
        subscribers.removeByEmail(email)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function removeById(id) {
    return new Promise((resolve, reject) => {
        subscribers.removeById(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function subscribe(email) {
    return new Promise((resolve, reject) => {
        subscribers.subscribe({email})
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            });
    });
}

function findByEmail(email) {
    return new Promise((resolve, reject) => {
        subscribers
        .findByEmail(email)
        .then((result) => resolve(result), 
            (err) => {
                reject(err);
            }
        );
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        subscribers
        .getById(id)
        .then((result) => resolve(result), 
            (err) => {
                reject(err);
            }
        );
    });
}
