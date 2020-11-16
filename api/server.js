require('rootpath')();
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const errorHandler = require('helpers/error-handler');
var multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:9000', 'http://localhost:4000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('Access-Control-Allow-Headers', 'Content-Name');
  //res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
  next();
});

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// global error handler
app.use(errorHandler);

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to meduse." });
});

// api routes
app.use('/api/users', require('./users/users.controller'));
app.use('/api/products', require('./products/products.controller'));
app.use('/api/productvariants', require('./products/productVariants.controller'));
app.use('/api/addresses', require('./addresses/addresses.controller'));
app.use('/api/categories', require('./categories/categories.controller'));
app.use('/api/blogs', require('./blog/blog.controller'));
app.use('/api/manufacturers', require('./manufacturers/manufacturers.controller'));
app.use('/api/coupons', require('./coupons/coupons.controller'));
app.use('/api/orders', require('./orders/orders.controller'));
app.use('/api/orderrows', require('./orderRows/orderRows.controller'));
app.use('/api/settings', require('./settings/settings.controller'));

//Serves all the request which includes /images in the url from Images folder
app.use('/static/blogs', express.static(__dirname + '/public/blog'));
app.use('/static/products', express.static(__dirname + '/public/pimages'));
app.use('/static/invoices', express.static(__dirname + '/public/invoices'));

var blogStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, __dirname + '/public/blog')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, 'blogImage-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var productsStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, __dirname + '/public/pimages')
  },
  filename: function (req, file, cb) {
      cb(null, 'pImage-' + uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var productVariantsStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, __dirname + '/public/pimages')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var blogUpload = multer({ //multer settings
  storage: blogStorage
}).single('file');

var productUpload = multer({ //multer settings
  storage: productsStorage
}).any();

var productVariantUpload = multer({ //multer settings
  storage: productVariantsStorage
}).any();


/** API path that will upload the files */
app.post('/blogupload', function(req, res) {
  blogUpload(req,res,function(err){
    if(err){
      console.log('multer error');
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({filename: req.file.filename, error_code:0, err_desc:null});
  })
});

app.post('/productupload', function(req, res) {
  productUpload(req,res,function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({files: req.files, error_code:0, err_desc:null});
  })
});

app.post('/productvariantupload', function(req, res) {
  productVariantUpload(req,res,function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({files: req.files, error_code:0, err_desc:null});
  })
});

// set port, listen for requests
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000.");
});