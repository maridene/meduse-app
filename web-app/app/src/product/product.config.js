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
            const id = $stateParams.slug.split('-')[0];
            return ProductService.getProductById(id).then((data) => {
              if (!(data.product && data.product.label && data.product.label.length)) {
                $state.go('app.home');  
              }
              return data;
            }, (error) => {
              $state.go('app.home');
            });
          },
          relatedProducts: function(ProductService, $stateParams) {
            const id = $stateParams.slug.split('-')[0];
            return ProductService.getRelatedProducts(id).then((relatedProducts) => {
              return relatedProducts;
            })
          }
        }
      });

};

export default ProductConfig;