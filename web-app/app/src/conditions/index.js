import angular from 'angular';

// Create the module where our functionality can attach to
let index = angular.module('app.conditions', []);

// Include our UI-Router config settings
import ConditionsConfig from './conditions.config';
index.config(ConditionsConfig);


// Controllers
import ConditionsController from './conditions.controller';
index.controller('ConditionsCtrl', ConditionsController);

export default index;