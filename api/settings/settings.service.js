
const settings = require('./settings.model');

module.exports = {
    getByLabel,
    getByType,
    getAll,
    updateByLabel
};

function getByLabel(label) {
    return new Promise((resolve, reject) => {
        settings.getByLabel(label)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function getByType(type) {
    return new Promise((resolve, reject) => {
        settings.getByType(type)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function getAll() {
    return new Promise((resolve, reject) => {
        settings.getAll()
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}

function updateByLabel(label, value) {
    return new Promise((resolve, reject) => {
        settings.updateByLabel(label, value)
            .then((result) => {
                resolve(result);
            }, (error) => {
                reject(error);
            })
    });
}
