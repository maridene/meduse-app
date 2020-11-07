const sql = require("../model/db.js");
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
          console.log("[ProductVariant.getById]: found product variant: ", res[0].id);
          resolve(res[0]);
        } else {
          console.log(`no product variant found with id = ${productId}`);
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
            console.log(`[ProductVariant.getByProductId]: found product varaiants for product with id ${productId} :${res.length}`);
            resolve(res);
          } else {
            console.log(`[ProductVariant.getByProductId]: no product variants found for product with id = ${productId}`);
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
        console.log("found product variant: ", res[0]);
        resolve(res[0]);
      } else {
        console.log(`no product variant found with sku = ${sku}`);
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
                console.log('not found product variants with the product id = ' + productId);
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
            "quantity = ?, " + 
            "image = ? " + 
            "WHERE id = ?",
            [
                productVariant.sku,
                productVariant.color,
                productVariant.size,
                productVariant.quantity,
                productVariant.image,
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


module.exports = ProductVariant;