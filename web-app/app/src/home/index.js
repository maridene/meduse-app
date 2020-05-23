// Create the module where our functionality can attach to
let index = angular.module('app.home', []);

// Include our UI-Router config settings
import HomeConfig from './home.config';
index.config(HomeConfig);


// Controllers
import HomeCtrl from './home.controller';
index.controller('HomeCtrl', HomeCtrl);


export default index;