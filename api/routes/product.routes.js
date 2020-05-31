module.exports = app => {
  const products = require("../controllers/product.controller.js");

  // Create a new Product
  app.post("/products", products.create);

  // Retrieve all Products
  app.get("/products", products.findAll);

  // Retrieve a single Product with productId
  app.get("/products/:productId", products.findOne);

  // Update a Product with productId
  app.put("/products/:productId", products.update);

  // Delete a Product with productId
  app.delete("/products/:productId", products.delete);

  // Delete all Products
  app.delete("/products", products.deleteAll);

  //get Products by Category id
  app.get("/products/category/:categoryId", products.getProductsByCategory);
};