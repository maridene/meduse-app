const sql = require("../model/db.js");
const tables = require('../config/db.tables.js');

// constructor
const Product = function(product) {
  this.id = product.id;
  this.sku = product.sku;
  this.label = product.label;
  this.description = product.description;
  this.price = product.price;
  this.quantity = product.quantity;
  this.categoryId = product.categoryId;
  this.long_description = product.long_description;
  this.promo_price = product.promo_price;
  this.manufacturer = product.manufacturer;
  this.weight = product.weight;
  this.imgCount = product.imgCount;
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
          console.log("found product varaiants: ", res);
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
    sql.query(`SELECT * FROM ${tables.PRODUCTS} WHERE id = ${productId}`, 
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("found products: ", res);
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
                console.log("found products", res);
                resolve(res);
            }
        });
    });
}

Product.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.MANUFACTURERS}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("products: ", res);
        resolve(res);
      }
    });
  });
};

Product.findByRef =  (ref) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.MANUFACTURERS} WHERE LABEL = '${ref}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject({error: err});
      } else if (res.length) {
        console.log("found product: ", res[0]);
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
        console.log('count: ', res);
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
  let productsQuery =`select products.*, manufacturers.name as manufacturerName from products LEFT JOIN manufacturers ON products.manufacturerId = manufacturers.id where category_id = ${categoryId}`; 
  const index = orderByValues.map((item) => item.key).indexOf(orderBy);
  if (index !== -1) {
    productsQuery +=  ` ORDER BY ${orderByValues[index].value}`;
  }
  if (!isNaN(startAt) && !isNaN(maxResult) && startAt >= 0 && maxResult > 0) {
    productsQuery += ` LIMIT ${startAt}, ${maxResult}`;
  }
  return productsQuery;
}

Product.create = (product) => {
  return new Promise((resolve, reject) => {
    console.log(product);
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


module.exports = Product;