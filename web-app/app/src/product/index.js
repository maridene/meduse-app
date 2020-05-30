// Create the module where our functionality can attach to
let index = angular.module('app.product', []);

// Include our UI-Router config settings
import ProductConfig from './product.config';
index.config(ProductConfig);


// Controllers
import ProductCtrl from './product.controller';
index.controller('ProductCtrl', ProductCtrl);


export default index;