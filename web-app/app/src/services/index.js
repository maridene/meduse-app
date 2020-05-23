import angular from 'angular';
import categoryService from './categoryService';
import restService from './restService';
import objectBuilder from './objectBuilder';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

servicesModule.factory('CategoryService', categoryService);
servicesModule.factory('RestService', restService);
servicesModule.factory('ObjectBuilder', objectBuilder);



export default servicesModule;