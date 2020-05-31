const sql = require("./db.js");

// constructor
const Product = function(product) {
  this.label = product.label;
  this.description = product.description;
  this.price = product.price;
  this.quantity = product.quantity;
  this.video_link = product.video_link;
  this.category_id = product.category_id;
};

Product.create = (newProduct, result) => {
  sql.query("INSERT INTO products SET ?", newProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created product: ", { id: res.insertId, ...newProduct });
    result(null, { id: res.insertId, ...newProduct });
  });
};

Product.findById = (productId, result) => {
  sql.query(`SELECT * FROM products WHERE id = ${productId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found product: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Product with the id
    result({ kind: "not_found" }, null);
  });
};

Product.getAll = result => {
  sql.query("SELECT * FROM products", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("products: ", res);
    result(null, res);
  });
};

Product.updateById = (id, product, result) => {
  sql.query(
      "UPDATE products SET " +
      "label = ?, " +
      "description = ?, " +
      "price = ?, " +
      "quantity = ?, " +
      "video_link = ?, " +
      "category_id = ? " +
      "WHERE id = ?",
      [
        product.label,
        product.description,
        product.price,
        product.quantity,
        product.video_link,
        product.category_id,
        id
      ],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Product with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated product: ", { id: id, ...product });
        result(null, { id: id, ...product });
      }
  );
};

Product.remove = (id, result) => {
  sql.query("DELETE FROM products WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Product with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted product with id: ", id);
    result(null, res);
  });
};

Product.removeAll = result => {
  sql.query("DELETE FROM products", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} products`);
    result(null, res);
  });
};

Product.getByCategory = (categoryId, result) => {
  sql.query(`SELECT * FROM products WHERE category_id = ${categoryId}`, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.length === 0) {
          console.log("no product found in categoryId: ", categoryId);
          result(null, []);
          return;
        }

        if (res.length) {
          console.log("found products: ", res);
          result(null, res);
          return;
        }

        // not found Product with the id
        result({ kind: "not_found" }, null);
  });
};

module.exports = Product;