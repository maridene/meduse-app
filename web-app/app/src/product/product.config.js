function ProductConfig($stateProvider) {
  'ngInject';

  $stateProvider
      .state('app.product', {
        url: '/product/:slug',
        controller: 'ProductCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'product/product.html',
        resolve : {
          data: function(AppConstants, ProductService, $state, $stateParams, ngMeta) {
            const id = $stateParams.slug.split('-')[0];
            return ProductService.getProductById(id).then((data) => {
              if (!(data.product && data.product.label && data.product.label.length)) {
                $state.go('app.home');  
              }
              ngMeta.setTitle(data.product.label);
              const imageUrls = data.product.images && data.product.images.length ?
                data.product.images.split(',').map((each) => `${AppConstants.productsStaticContentUrl}${each}`) : [];
              const imageUrl = imageUrls.length ? imageUrls [0] : '';
              ngMeta.setTag('og:image', imageUrl);
              ngMeta.setTag('og:description', data.description);
              ngMeta.setTag('og:title', data.title);
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
        },
        meta: {
          disableUpdate: true
        }
      });

};

export default ProductConfig;