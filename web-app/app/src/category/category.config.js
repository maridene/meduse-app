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
          data: function(ProductService, $state, $stateParams) {
            return ProductService.getProductsByCategory($stateParams.slug, 0, 10, 'default').then(
                (data) => {
                  data.categoryId = $stateParams.slug;
                  return data;
                },
                (err) => $state.go('app.home')
            )
          }
        }
      });

};

export default CategoryConfig;