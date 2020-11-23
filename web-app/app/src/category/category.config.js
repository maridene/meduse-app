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
            const id = $stateParams.slug.split('-')[0];
            const categoryName = $stateParams.slug.split('-')[1];
            return ProductService.getProductsByCategory(id, 0, 0, 'default').then(
                (data) => {
                  data.categoryId = id;
                  data.categoryName = categoryName;
                  return data;
                },
                (err) => $state.go('app.home')
            )
          }
        }
      });

};

export default CategoryConfig;