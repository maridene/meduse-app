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
  //res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
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
app.use('/addresses', require('./addresses/addresses.controller'));
app.use('/categories', require('./categories/categories.controller'));
app.use('/blogs', require('./blog/blog.controller'));
app.use('/manufacturers', require('./manufacturers/manufacturers.controller'));


app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/images', express.static(__dirname + '/images'));

//Serves all the request which includes /images in the url from Images folder
app.use('/blog', express.static(__dirname + '/public/blog'));
app.use('/pimage', express.static(__dirname + '/public/products'));

var blogStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './public/blog/')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, 'blogImage-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var productsStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './public/pimage/')
  },
  filename: function (req, file, cb) {
      cb(null, 'pImage-' + uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var blogUpload = multer({ //multer settings
  storage: blogStorage
}).single('file');

var productUpload = multer({ //multer settings
  storage: productsStorage
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
  console.log(req.productImages);
  console.log(req.body);
  productUpload(req,res,function(err){
    if(err){
      res.json({error_code:1,err_desc:err});
      return;
    }
    res.json({files: req.files, error_code:0, err_desc:null});
  })
});

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});