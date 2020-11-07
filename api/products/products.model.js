const sql = require("../model/db.js");
const tables = require('../config/db.tables.js');

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
          console.log(`no product variants found for product with id = ${productId}`);
          resolve([]);
        }
      }
    });
  });
}

Product.findById = (productId) => {
  return new Promise((resolve, reject) => {
    sql.query(findByIdQuery(productId), 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          resolve(res[0]);
        } else {
          console.log(`no products found with id = ${productId}`);
          resolve([]);
        }
        
      }
    });
  });
};

Product.findByCategory = (categoryId, startAt, maxResult, orderBy) => {
    return new Promise((resolve, reject) => {
        sql.query(findByCategoryQuery(categoryId, startAt, maxResult, orderBy), (err, res) => {
            if (err) {
                console.log(err);
                reject(err);
            } else if (res) {
                console.log("found products in category:", res.length);
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
        console.log("all products: ", res.length);
        resolve(res);
      }
    });
  });
};

Product.search = (query) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.PRODUCTS} WHERE label LIKE '%${query}%'`, (err, res) => {
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

Product.countItemsByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT COUNT(*) FROM ${tables.PRODUCTS} WHERE CATEGORY_ID = ${categoryId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject({error: err});
      } else {
        resolve(res);
      }
    });
  });
}

function findByCategoryQuery(categoryId, startAt, maxResult, orderBy) {
  const orderByValues = [
    {key: 'priceUp', value: 'price ASC'},
    {key: 'priceDown', value: 'price DESC'},
    {key: 'AZ', name:'label ASC'},
    {key: 'ZA', value:'label DESC'}
  ];
  let productsQuery =`select products.*, M.name AS manufacturerName, C.label AS categoryLabel FROM ${tables.PRODUCTS}
    LEFT JOIN ${tables.MANUFACTURERS} as M
      ON M.id = ${tables.PRODUCTS}.manufacturerId
    LEFT JOIN ${tables.CATEGORIES} as C
      ON C.id = ${tables.PRODUCTS}.category_id
    WHERE category_id = ${categoryId}`;

  const index = orderByValues.map((item) => item.key).indexOf(orderBy);
  if (index !== -1) {
    productsQuery +=  ` ORDER BY ${orderByValues[index].value}`;
  }
  if (!isNaN(startAt) && !isNaN(maxResult) && startAt >= 0 && maxResult > 0) {
    productsQuery += ` LIMIT ${startAt}, ${maxResult}`;
  }
  return productsQuery;
}

function findByIdQuery(id) {
  return `select products.*, M.name AS manufacturerName, C.label AS categoryLabel FROM ${tables.PRODUCTS}
    LEFT JOIN ${tables.MANUFACTURERS} as M
      ON M.id = ${tables.PRODUCTS}.manufacturerId
    LEFT JOIN ${tables.CATEGORIES} as C
      ON C.id = ${tables.PRODUCTS}.category_id
    WHERE products.id = ${id}`;
}

function findPinnedQuery() {
  return `select * From ${tables.PRODUCTS} where pinned = '1'`;
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
      "modificationDate = ? " +
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

Product.lastNProducts = (n) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.PRODUCTS} ORDER BY creationDate DESC LIMIT ${n}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        resolve(res);
      }
    });
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

Product.pinnedProducts = () => {
  return new Promise((resolve, reject) => {
    sql.query(findPinnedQuery(), 
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

Product.getProductsFromTags = (productId, tags) => {
  return new Promise((resolve, reject) => {
    sql.query(findByTagsQuery(productId, tags), (err, res) => {
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

Product.getProductsInSameCategory = (categoryId, productId,  maxResult, ignoredIds) => {
  return new Promise((resolve, reject) => {
    sql.query(findInSameCategoryQuery(categoryId, productId,  maxResult, ignoredIds), (err, res) => {
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

function findInSameCategoryQuery(categoryId, productId,  maxResult, ignoredIds) {
  if (ignoredIds && ignoredIds.length) {
    return `SELECT * FROM ${tables.PRODUCTS} WHERE id Not IN (${productId}, ${ignoredIds.join(', ')}) AND category_id = '${categoryId}' LIMIT ${maxResult};`; 
  } else {
    return `SELECT * FROM ${tables.PRODUCTS} WHERE id <> '${productId}' AND category_id = '${categoryId}' LIMIT ${maxResult};`; 
  }
}

function findByTagsQuery(productId, tags) {
  const tagsCondition = 'tags ' + tags.map((item) => `LIKE '%${item}%' `).join(' OR tags ');
  return `SELECT * FROM ${tables.PRODUCTS} WHERE id <> ${productId} AND ( ${tagsCondition} )`; 
}


module.exports = Product;