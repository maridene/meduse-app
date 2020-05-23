import angular from 'angular';

// Create the module where our functionality can attach to
let index = angular.module('app.contact', []);

// Include our UI-Router config settings
import contactConfig from './contact.config';
index.config(contactConfig);


// Controllers
import ContactCtrl from './contact.controller';
index.controller('ContactCtrl', ContactCtrl);


export default index;