const Product = require("../model/product.model.js");

// Create and Save a new Product
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Product
  const product = new Product({
    label: req.body.label,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
    video_link: req.body.video_link,
    category_id: req.body.category_id
  });

  // Save Product in the database
  Product.create(product, (err, data) => {
    if (err)
      res.status(500).send({
        message:
        err.message || "Some error occurred while creating the Product."
      });
    else res.send(data);
  });
};

// Retrieve all Products from the database.
exports.findAll = (req, res) => {
  Product.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving products."
      });
    else res.send(data);
  });
};

// Find a single Product with a productId
exports.findOne = (req, res) => {
  Product.findById(req.params.productId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.productId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Product with id " + req.params.productId
        });
      }
    } else res.send(data);
  });
};

// Update a Product identified by the productId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Product.updateById(
      req.params.productId,
      new Product(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Product with id ${req.params.productId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Product with id " + req.params.productId
            });
          }
        } else res.send(data);
      }
  );
};

// Delete a Product with the specified productId in the request
exports.delete = (req, res) => {
  Product.remove(req.params.productId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Product with id ${req.params.productId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Product with id " + req.params.productId
        });
      }
    } else res.send({ message: `Product was deleted successfully!` });
  });
};

// Delete all Products from the database.
exports.deleteAll = (req, res) => {
  Product.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
        err.message || "Some error occurred while removing all products."
      });
    else res.send({ message: `All Products were deleted successfully!` });
  });
};

// Get products by category id
exports.getProductsByCategory = (req, res) => {
  Product.getByCategory(req.params.categoryId, (err, data) => {
    if (err) {
      res.status(500).send({
        message: "Error retrieving Products with category id " + req.params.categoryId
      });
    } else res.send(data);
  });
};
