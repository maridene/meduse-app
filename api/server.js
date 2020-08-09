require('rootpath')();
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const errorHandler = require('helpers/error-handler');

const app = express();

app.use(cors());

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
  next();
});

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// global error handler
app.use(errorHandler);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to meduse." });
});

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/products', require('./products/products.controller'));
app.use('/assets', require('./assets/assets.controller'));

require("./routes/category.routes.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});