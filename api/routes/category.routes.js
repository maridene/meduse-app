module.exports = app => {
  const categories = require("../controllers/category.controller.js");

  // Create a new Category
  app.post("/categories", categories.create);

  // Retrieve all Categories
  app.get("/categories", categories.findAll);

  // Retrieve a single Category with categoryId
  app.get("/categories/:categoryId", categories.findOne);

  // Update a Category with categoryId
  app.put("/categories/:categoryId", categories.update);

  // Delete a Category with categoryId
  app.delete("/categories/:categoryId", categories.delete);

  // Delete all Categories
  app.delete("/categories", categories.deleteAll);
};
