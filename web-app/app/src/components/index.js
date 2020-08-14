import angular from 'angular';
import ProductItemController from './productItem.component';
let componentsModule = angular.module('app.components', []);

componentsModule.component('productItem', {
    templateUrl: 'components/productItem.html',
    controller: ProductItemController,
    bindings: {
        product: '='
    }}
);

export default componentsModule;