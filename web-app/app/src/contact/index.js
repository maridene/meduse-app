import angular from 'angular';

// Create the module where our functionality can attach to
let index = angular.module('app.contact', []);

// Include our UI-Router config settings
import ContactConfig from './contact.config';
index.config(ContactConfig);


// Controllers
import ContactCtrl from './contact.controller';
index.controller('ContactCtrl', ContactCtrl);


export default index;