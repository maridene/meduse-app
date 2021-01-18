import angular from 'angular';

// Import our app config files
import {AppConstants, ApiConstants}  from './config/app.constants';
import appConfig  from './config/app.config';
import appRun     from './config/app.run';
import 'angular-ui-router';
import 'angular-route';
import 'angular-cookies';
import 'angular-material';
import 'angular-sanitize';
// Import our templates file (generated by Gulp)
import './config/app.templates';
// Import our app functionaity
import './layout';
//import './components';
import './home';
import './contact';
import './product';
import './category';
import './services';
import './login';
import './register';
import './passwordReset';
import './premium';
import './blog';
import './profile';
import './components';
import './cart';
import './checkout';
import './promotions';
import './conditions';


// Create and bootstrap application
const requires = [
  'ngSanitize',
  'ui.router',
  'ngRoute',
  'ngCookies',
  'ngMaterial',
  'templates',
  'app.layout',
  'app.home',
  'app.contact',
  'app.product',
  'app.category',
  'app.services',
  'app.components',
  'app.login',
  'app.register',
  'app.passwordReset',
  'app.premium',
  'app.blog',
  'app.profile',
  'app.cart',
  'app.checkout',
  'app.promotions',
  'app.conditions'
];

angular.module('app', requires);

angular.module('app').constant('AppConstants', AppConstants);

angular.module('app').config(appConfig);

angular.module('app').run(appRun);
