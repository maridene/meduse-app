import angular from 'angular';
import CategoryService from './categoryService';
import ProductService from './productService';
import RestService from './restService';
import ObjectBuilder from './objectBuilder';
import UserService from './userService';
import AuthenticationService from './authenticationService';
import CartService from './cartService';
import ToastService from './toastService';
import AddressesService from './addressesService';
import PointsService from './pointsService';
import BlogService from './blogService';

// Create the module where our functionality can attach to
let servicesModule = angular.module('app.services', []);

servicesModule.service('CategoryService', CategoryService);
servicesModule.service('ProductService', ProductService);
servicesModule.service('RestService', RestService);
servicesModule.service('ObjectBuilder', ObjectBuilder);
servicesModule.service('UserService', UserService);
servicesModule.service('AuthenticationService', AuthenticationService);
servicesModule.service('CartService', CartService);
servicesModule.service('ToastService', ToastService);
servicesModule.service('AddressesService', AddressesService);
servicesModule.service('PointsService', PointsService);
servicesModule.service('BlogService', BlogService);



export default servicesModule;