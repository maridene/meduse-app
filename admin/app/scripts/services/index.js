'use strict';

angular.module('sbAdminApp.services', [])
    .config(['$ocLazyLoad',function ($ocLazyLoad) {
        $ocLazyLoad.load({
            name:'sbAdminApp.services',
            files:[
                './../models/address.js',
                './../models/cart.js',
                './../models/cartRow.js',
                './../models/category.js',
                './../models/product.js',
                './../models/productVariant.js',
                './../models/user.js',
                './objectBuilder.js',
                './restService.js',
                './categoryService.js',
                './productService.js'
            ]
        });
    }]);
