import angular from 'angular';

// Create the module where our functionality can attach to
let index = angular.module('app.checkout', []);

// Include our UI-Router config settings
import CheckoutConfig from './checkout.config';
index.config(CheckoutConfig);


// Controllers
import CheckoutCtrl from './checkout.controller';
index.controller('CheckoutCtrl', CheckoutCtrl);


export default index;