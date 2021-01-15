const sql = require("../config/db.js");
const tables = require('../config/db.tables.js');
const router = require("./products.controller.js");
const queryUtils = require('./productsQuery.utils.js');

// constructor
const Product = function(product) {
  this.id = product.id;
  this.sku = product.sku;
  this.label = product.label;
  this.description = product.description;
  this.price = product.price;
  this.tva = product.tva;
  this.quantity = product.quantity;
  this.categoryId = product.categoryId;
  this.long_description = product.long_description;
  this.promo_price = product.promo_price;
  this.manufacturer = product.manufacturer;
  this.weight = product.weight;
  this.imgCount = product.imgCount;
  this.tags = product.tags;
  this.creationDate = product.creationDate;
  this.modificationDate = product.modificationDate;
};

Product.getProductVariants = (productId) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.PRODUCT_VARAINT} WHERE product_id = ${productId}`,
     (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("found product varaiants: ", res.length);
          resolve(res);
        } else {
          resolve([]);
        }
      }
    });
  });
}

/************************************************/
//                    Admin
/************************************************/
Product.getById = (productId) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.getByIdQuery(productId), 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          resolve(res[0]);
        } else {
          console.log(`[Product.findById]: no products found with id = ${productId}`);
          resolve([]);
        }
      }
    });
  });
};
Product.getByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
      sql.query(queryUtils.getByCategoryQuery(categoryId), (err, res) => {
          if (err) {
              console.log(err);
              reject(err);
          } else if (res) {
              console.log("[Product.getByCategory]: found products in category: ", res.length);
              resolve(res);
          }
      });
  });
}

Product.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.PRODUCTS}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("[Product.getAll]: all products: ", res.length);
        resolve(res);
      }
    });
  });
};

Product.create = (product) => {
  return new Promise((resolve, reject) => {
    const creationDate = new Date();
    product.creationDate = creationDate;
    sql.query(`INSERT INTO ${tables.PRODUCTS} SET ?`, product, (err, res) => {
        if (err) {
            console.log("error: ", err);
            reject(err);
        }
        resolve({ id: res.insertId, ...product });
    });
  });
};

Product.deleteById = (id) => {
  return new Promise((resolve, reject) => {
    sql.query(`DELETE FROM ${tables.PRODUCTS} WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }

      if (res.affectedRows == 0) {
          // not found product with the id
          reject();
          return;
      }

      console.log("deleted product with id: ", id);
      resolve(res);
    });
  });
};

Product.updateById = (id, product, result) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.PRODUCTS} SET ` +
      "label = ?, " +
      "description = ?, " +
      "price = ?, " +
      "tva = ?, " +
      "quantity = ?, " +
      "lowStockThreshold = ?, " +
      "category_id = ?, " +
      "long_description = ?, " +
      "promo_price = ?, " +
      "manufacturerId = ?, " +
      "weight = ?, " +
      "images = ?, " +
      "video_link = ?, " +
      "tags = ?, " +
      "creationDate = ?, " +
      "modificationDate = ?, " +
      "extendCategories = ? " +
      "WHERE id = ?",
      [
        product.label,
        product.description,
        product.price,
        product.tva,
        product.quantity,
        product.lowStockThreshold,
        product.category_id,
        product.long_description,
        product.promo_price,
        product.manufacturerId,
        product.weight,
        product.images,
        product.video_link,
        product.tags,
        product.creationDate,
        product.modificationDate,
        product.extendCategories,
        id
      ],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found product with the id
          reject({ kind: "not_found" });
          return;
        }

        console.log("updated product: ", { id: id});
        resolve({ id: id, ...product });
      }
    );
  });
  
};

Product.updatePinState = (id, state) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.PRODUCTS} SET ` +
      "pinned = ? " +
      "WHERE id = ? ", 
      [
        state, 
        id
      ], (err, res) => {
        if (err) {
          console.log("Error while updating product state, productId = ", id);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found product with the id
          reject({ kind: "not_found" });
          return;
        }
        console.log("updated product: ", id);
        resolve({ id: id, pinned: state });
      });
  });
};

Product.updateIsNew = (id, value) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.PRODUCTS} SET ` +
      "isNew = ? " +
      "WHERE id = ? ", 
      [
        value, 
        id
      ], (err, res) => {
        if (err) {
          console.log("Error while updating product isNew, productId = ", id);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found product with the id
          reject({ kind: "not_found" });
          return;
        }
        console.log("updated product: ", id);
        resolve({ id: id, isNew: value });
      });
  });
};

Product.updateIsExclusif = (id, value) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.PRODUCTS} SET ` +
      "isExclusif = ? " +
      "WHERE id = ? ", 
      [
        value, 
        id
      ], (err, res) => {
        if (err) {
          console.log("Error while updating product isExclusif, productId = ", id);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found product with the id
          reject({ kind: "not_found" });
          return;
        }
        console.log("updated product: ", id);
        resolve({ id: id, isExclusif: value });
      });
  });
};

Product.updateIsHidden = (id, value) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.PRODUCTS} SET ` +
      "isHidden = ? " +
      "WHERE id = ? ", 
      [
        value, 
        id
      ], (err, res) => {
        if (err) {
          console.log("Error while updating product isHidden, productId = ", id);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found product with the id
          reject({ kind: "not_found" });
          return;
        }
        console.log("updated product: ", id);
        resolve({ id: id, isHidden: value });
      });
  });
};

Product.updateOrderIndex = (id, value) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.PRODUCTS} SET ` +
      "orderIndex = ? " +
      "WHERE id = ? ", 
      [
        value, 
        id
      ], (err, res) => {
        if (err) {
          console.log("Error while updating product order index, productId = ", id);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found product with the id
          reject({ kind: "not_found" });
          return;
        }
        console.log("updated product order index: ", id);
        resolve({ id: id, isHidden: value });
      });
  });
};

/************************************************/
//                    User
/************************************************/

Product.findById = (productId, params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.findByIdQuery(productId, params), 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          resolve(res[0]);
        } else {
          console.log(`[Product.findById]: no products found with id = ${productId}`);
          resolve([]);
        }
      }
    });
  });
};

Product.findByCategory = (categoryId, params) => {
    return new Promise((resolve, reject) => {
        sql.query(queryUtils.findByCategoryQuery(categoryId, params), (err, res) => {
            if (err) {
                console.log(err);
                reject(err);
            } else if (res) {
                console.log("[Product.findByCategory]: found products in category:", res.length);
                resolve(res);
            }
        });
    });
}

Product.search = (query, params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.getSearchQuery(query, params), (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("search result: ", res.length);
        resolve(res);
      }
    });
  });
};

Product.findByRef =  (ref) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.PRODUCTS} WHERE sku = '${ref}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject({error: err});
      } else if (res.length) {
        console.log("[findByRef]: found product id: ", res[0].id);
        resolve(res[0]);
      } else {
        console.log(`no product found with reference = ${ref}`);
        resolve([]);
      }
    });
  });
};

Product.countItemsByCategory = (categoryId, params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.countByCategoryQuery(categoryId, params), (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject({error: err});
      } else {
        resolve(res);
      }
    });
  });
}

Product.lastNProducts = (n, params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.lastNProductsQuery(n, params), (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

Product.pinnedProducts = (params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.findPinnedQuery(params), 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("[pinnedProducts]: found products: ", res.length);
          resolve(res);
        } else {
          console.log('[pinnedProducts]: no products found');
          resolve([]);
        }
      }
    });
  });
};

Product.getNewProducts = (params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.findNewQuery(params), 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("[NewProducts]: found products: ", res.length);
          resolve(res);
        } else {
          console.log('[NewProducts]: no products found');
          resolve([]);
        }
      }
    });
  });
};

Product.getPromoProducts = (params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.getPromoQuery(params), 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("[getPromoProducts]: found products: ", res.length);
          resolve(res);
        } else {
          console.log('[getPromoProducts]: no products found');
          resolve([]);
        }
      }
    });
  });
};

Product.getProductsFromTags = (productId, tags, params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.findByTagsQuery(productId, tags, params), (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("[getProductsFromTags]: found products: ", res.length);
          resolve(res);
        } else {
          console.log('[getProductsFromTags]: No products found with given tags: ', tags);
          resolve([]);
        }
      }
    })
  });
};

Product.getProductsInSameCategory = (categoryId, productId,  maxResult, ignoredIds, params) => {
  return new Promise((resolve, reject) => {
    sql.query(queryUtils.findInSameCategoryQuery(categoryId, productId,  maxResult, ignoredIds, params), (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("[getProductsInSameCategory]: found products: ", res.length);
          resolve(res);
        } else {
          console.log('No products found in category: ', categoryId);
          resolve([]);
        }
      }
    });
  });
};

Product.updateProductQuantity = (id, qty) => {
  return new Promise((resolve, reject) => {
    sql.query(`UPDATE ${tables.PRODUCTS} SET ` +
    "quantity = ? " +
    "WHERE id = ? ", 
    [
      qty, 
      id
    ], (err, res) => {
      if (err) {
        console.error("[Product.updateProductQuantity]: Error while updating product quantity, productId = ", id);
        reject(err);
        return;
      }
      if (res.affectedRows == 0) {
        console.error("[Product.updateProductQuantity]: not found product with the id, productId = ", id);
        // not found product with the id
        reject({ kind: "not_found" });
        return;
      }
      console.log("[Product.updateProductQuantity]: updated product quantity id = ", id);
      resolve({ id: id, quantity: qty });
    });
  });
}

module.exports = Product;
