const sql = require("../model/db.js");

// constructor
const Product = function(product) {
  this.id = product.id;
  this.sku = product.sku;
  this.label = product.label;
  this.description = product.description;
  this.price = product.price;
  this.quantity = product.quantity;
  this.categoryId = product.categoryId;
};

Product.getProductVariants = (productId) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM (SELECT * FROM PRODUCTVARIANT WHERE product_id = ${productId}) AS P 
    LEFT JOIN (SELECT assets.image, assets.sku FROM ASSETS) AS A ON (P.sku = A.sku)`,
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
    sql.query(`SELECT * FROM PRODUCTS WHERE id = ${productId}`, 
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

Product.getProductImages = (sku) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ASSETS WHERE sku = "${sku}"`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log(`found ${res.length} images for product sku = ${sku}`);
          resolve(res);
        } else {
          console.log(`no image found for product with sku = ${sku}`);
          reject();
        }
      }
    })
  });
}

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
  let productsQuery =`SELECT * FROM (select * from PRODUCTS where category_id = ${categoryId}`; 
  const index = orderByValues.map((item) => item.key).indexOf(orderBy);
  if (index !== -1) {
    productsQuery +=  ` ORDER BY ${orderByValues[index].value}`;
  }
  if (!isNaN(startAt) && !isNaN(maxResult) && startAt >= 0 && maxResult > 0) {
    productsQuery += ` LIMIT ${startAt}, ${maxResult}`;
  }
  productsQuery += ')';
  const query = `${productsQuery} AS P LEFT JOIN (SELECT assets.image, assets.sku FROM ASSETS) As A ON (P.sku = A.sku)`;
  
  console.log(query);
  return query;
}


module.exports = Product;