function PromotionsConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.promotions', {
          url: '/promotions',
          controller: 'PromotionsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'promotions/promotions.html',
          data: {
            meta: {
              'title': 'Nos promotions'
            }
          },
          resolve : {
            products: function(ProductService, $state) {
              return ProductService.getPromoProducts().then((products) => {
                return products;
              }, (error) => {
                $state.go('app.home');
              });
            },
            manufacturers: function(ManufacturersService, $state) {
                return ManufacturersService.getAll().then((manufacturers) => {
                  return manufacturers;
                }, (error) => {
                  $state.go('app.home');
                });
              }
          }
        });
  
  };
  
  export default PromotionsConfig;