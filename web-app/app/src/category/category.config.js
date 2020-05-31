function CategoryConfig($stateProvider) {
  'ngInject';

  $stateProvider
      .state('app.category', {
        url: '/category/:slug',
        controller: 'CategoryCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'category/category.html',
        title: 'Category',
        resolve: {
          products: function(ProductService, $state, $stateParams) {
            return ProductService.getProductsByCategory($stateParams.slug).then(
                (products) => products,
                (err) => $state.go('app.home')
            )
          }
        }
      });

};

export default CategoryConfig;