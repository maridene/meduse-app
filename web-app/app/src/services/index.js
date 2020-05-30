import angular from 'angular';
import CategoryService from './categoryService';
import RestService from './restService';
import ObjectBuilder from './objectBuilder';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

servicesModule.service('CategoryService', CategoryService);
servicesModule.service('RestService', RestService);
servicesModule.service('ObjectBuilder', ObjectBuilder);



export default servicesModule;