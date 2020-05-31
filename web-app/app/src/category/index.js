import angular from 'angular';

// Create the module where our functionality can attach to
let index = angular.module('app.category', []);

// Include our UI-Router config settings
import CategoryConfig from './category.config';
index.config(CategoryConfig);


// Controllers
import CategoryCtrl from './category.controller';
index.controller('CategoryCtrl', CategoryCtrl);


export default index;