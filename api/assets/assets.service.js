const assets = require('./assets.model');

module.exports =  {
    add,
    findById,
    getByProductRef
}

function add(asset = {productRef, image}) {
    return new Promise((resolve, reject) => {
        assets.add(asset)
            .then((response) => {
                console.log("asset created");
                resolve(response);
            }, (err) => {
                console.log("couldnt add asset", asset);
                console.log("error :", err);
                reject(err);
            });
    });
}

function findById(id) {
    return new Promise((resolve, reject) => {
        assets.findById(id)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
    });
}

function getByProductRef(ref, main) {
    return new Promise((resolve, reject) => {
        assets.getByProductRef(ref, main)
            .then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
    });
}
