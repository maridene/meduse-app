function ProductConfig($stateProvider) {
  'ngInject';

  $stateProvider
      .state('app.product', {
        url: '/product/:slug',
        controller: 'ProductCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'product/product.html',
        title: 'Product',
        resolve : {
          data: function(ProductService, $state, $stateParams) {
            return ProductService.getProductById($stateParams.slug).then((data) => {
              return data;
            }, (error) => {
              $state.go('app.home');
            });
          },
          relatedProducts: function(ProductService, $stateParams) {
            return ProductService.getRelatedProducts($stateParams.slug).then((relatedProducts) => {
              return relatedProducts;
            })
          }
        }
      });

};

export default ProductConfig;