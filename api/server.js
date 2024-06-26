require('rootpath')();
require('dotenv').config({ path: __dirname + '/.env'});
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const errorHandler = require('helpers/error-handler');
var multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const expressSitemapXml = require('express-sitemap-xml')

const dev = process.env.dev === '1';
const useReporting = process.env.useReporting === '1';

if (dev) {
  console.log('App launched with dev profile!');
} else {
  console.log('App launched with production profile!');
}

const app = express();

app.use(cors());
app.use(require('prerender-node'));

// parse requests of content-type: application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:9000', 'http://localhost:4000', 'http://www.meduse.tn', 'http://www.admin.meduse.tn'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('Access-Control-Allow-Headers', 'Content-Name');
  res.append('Access-Control-Allow-Headers', 'userId');
  next();
});

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// global error handler
app.use(errorHandler);

// simple route
app.get('/api', (req, res) => {
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
app.use('/api/subscribe', require('./mailing/subscribers.controller'));
app.use('/api/contactform', require('./mailing/contactForm.controller'));
app.use('/api/invoice', require('./orders/invoices.controller'));
app.use('/api/ordersstats', require('./orders/ordersStats.controller'));
app.use('/api/agents', require('./agent/agent.controller'));
app.use('/api/export', require('./export/export.controller'));
if (useReporting) {
  console.log("Reporting is enabled");
  app.use('/api/report', require('./reporting/reporting.controller'));
}

//Serves all the request which includes /images in the url from Images folder
const staticContentDir = dev ? __dirname + '/public' : '/var/www/meduse-static';
app.use('/static/blogs', express.static(staticContentDir + '/blog'));
app.use('/static/products', express.static(staticContentDir + '/pimages'));
app.use('/static/invoices', express.static(staticContentDir + '/invoices'));

//sitemap
const sitemap = require('sitemap/sitemap');
app.use(expressSitemapXml(sitemap.getUrls, 'https://meduse.tn'));

var blogStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, staticContentDir + '/blog')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, 'blogImage-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var productsStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, staticContentDir + '/pimages')
  },
  filename: function (req, file, cb) {
      cb(null, 'pImage-' + uuidv4() + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var productVariantsStorage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, staticContentDir + '/pimages')
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