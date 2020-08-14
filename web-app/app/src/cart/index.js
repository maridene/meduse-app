// Create the module where our functionality can attach to
let index = angular.module('app.cart', []);

// Include our UI-Router config settings
import CartConfig from './cart.config';
index.config(CartConfig);


// Controllers
import CartCtrl from './cart.controller';
index.controller('CartCtrl', CartCtrl);


export default index;