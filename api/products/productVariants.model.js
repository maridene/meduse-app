const sql = require("../config/db.js");
const tables = require("../config/db.tables.js");

// constructor
const ProductVariant = function(productVariant) {
  this.id = productVariant.id;
  this.sku = productVariant.sku;
  this.product_id = productVariant.product_id;
  this.color = productVariant.color;
  this.size = productVariant.size;
  this.quantity = productVariant.quantity;
  this.image = productVariant.image;
};

ProductVariant.create = (productVariant) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.PRODUCT_VARAINT} SET ?`, productVariant, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
            resolve({ id: res.insertId, ...productVariant });
        });
    });
}

ProductVariant.getById = (productVariantId) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.PRODUCT_VARAINT} WHERE id = ${productVariantId}`, 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          resolve(res[0]);
        } else {
          resolve([]);
        }
        
      }
    });
  });
};

ProductVariant.getByProductId = (productId) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.PRODUCT_VARAINT} WHERE product_id = ${productId}`,
       (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          if (res.length) {
            resolve(res);
          } else {
            resolve([]);
          }
        }
      });
    });
};

ProductVariant.findBySku =  (sku) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.PRODUCT_VARAINT} WHERE sku = '${sku}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject({error: err});
      } else if (res.length) {
        resolve(res[0]);
      } else {
        resolve([]);
      }
    });
  });
};

ProductVariant.deleteById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.PRODUCT_VARAINT} WHERE id = '${id}'`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found product variant with the id
                reject();
                return;
            }
        
            console.log("deleted product variant with id: ", id);
            resolve(res);
        });
      });
};

ProductVariant.deleteBySku = (sku) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.PRODUCT_VARAINT} WHERE sku = '${sku}'`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found product variant with the id
                reject();
                return;
            }
        
            console.log("deleted product variant with id: ", id);
            resolve(res);
        });
      });
};

ProductVariant.deleteByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.PRODUCT_VARAINT} WHERE product_Id = '${productId}'`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found product variant with the product id
                resolve();
                return;
            }
        
            console.log("deleted product variants with product id: ", productId);
            resolve(res);
        });
      });
};

ProductVariant.updateById = (id, productVariant) => {
    return new Promise((resolve, reject) => {
        sql.query(
            `UPDATE ${tables.PRODUCT_VARAINT} SET ` +
            "sku = ?, " +
            "color = ?, " +
            "size = ?, " +
            "quantity = ? " + 
            "WHERE id = ?",
            [
                productVariant.sku,
                productVariant.color,
                productVariant.size,
                productVariant.quantity,
                id
            ],
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    reject(null, err);
                }
        
                if (res.affectedRows == 0) {
                    // not found product variant with the id
                    reject();
                }
        
                console.log("updated product variant: ", { id: id, ...productVariant });
                resolve({ id: id, ...productVariant });
            }
        );
    });
};

ProductVariant.updateProductVariantQuantity = (id, qty) => {
  return new Promise((resolve, reject) => {
    sql.query(`UPDATE ${tables.PRODUCT_VARAINT} SET ` +
    "quantity = ? " +
    "WHERE id = ? ", 
    [
      qty, 
      id
    ], (err, res) => {
      if (err) {
        reject(err);
        return;
      }
      if (res.affectedRows == 0) {
        // not found product with the id
        reject({ kind: "not_found" });
        return;
      }
      resolve({ id: id, quantity: qty });
    });
  });
};


module.exports = ProductVariant;