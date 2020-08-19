const sql = require("../model/db.js");

//constructor
const Asset = function(asset) {
    this.id = asset.id;
    this.productRef = asset.productRef;
    this.image = asset.image;
}

Asset.findById = (assetId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ASSETS WHERE id = ${assetId}`, (err, res) => {
            if (err)  {
                console.log("error: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("asset found with id" + assetId);
                    resolve(res);
                } else {
                    console.log("no asset found with id" + assetId);
                    reject({kind: "not_found"});
                }
            }
        })
    });
}

Asset.getByProductRef = (productRef, main) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ASSETS WHERE PRODUCTREF = '${productRef}'`;
        if (main === 1) {
            query += ' AND MAIN = 1';
        }
        sql.query(query, (err, res) => {
            if (err)  {
                console.log("error: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("asset found with productRef" + productRef);
                    resolve(res);
                } else {
                    console.log("no asset found with productRef" + productRef);
                    reject({kind: "not_found"});
                }
            }
        })
    });
}

Asset.add = (asset) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO ASSETS SET ? ", asset, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                console.log("asset added: ", asset);
            }
        });
    });
}

module.exports = Asset;
