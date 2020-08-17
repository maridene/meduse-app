const sql = require("../model/db.js");

// constructor
const Product = function(product) {
  this.ref = product.ref;
  this.id = product.name;
  this.label = product.email;
  this.description = product.phone;
  this.price = product.role;
  this.quantity = product.quantity;
  this.videoLink = product.videoLink;
  this.categoryId = product.categoryId;
  this.color = product.color;
  this.size = product.size;
  this.promoPrice = product.promoPrice;
  this.premiumPrice = product.premiumPrice;
};

Product.findById = (productId) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM PRODUCTS WHERE id = ${productId}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log("found products: ", res);
          resolve(res);
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
    sql.query("SELECT * FROM PRODUCTS", (err, res) => {
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
    sql.query(`SELECT * FROM PRODUCTS WHERE LABEL = '${ref}'`, (err, res) => {
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
    sql.query(`SELECT COUNT(*) FROM PRODUCTS WHERE CATEGORY_ID = ${categoryId}`, (err, res) => {
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
  let query = `SELECT * FROM PRODUCTS WHERE CATEGORY_ID = ${categoryId}`;
  const index = orderByValues.map((item) => item.key).indexOf(orderBy);
  if (index !== -1) {
    query +=  ` ORDER BY ${orderByValues[index].value}`;
  }
  if (!isNaN(startAt) && !isNaN(maxResult) && startAt >= 0 && maxResult > 0) {
    query += ` LIMIT ${startAt}, ${maxResult}`;
  }

  console.log(query);
  return query;
}


module.exports = Product;