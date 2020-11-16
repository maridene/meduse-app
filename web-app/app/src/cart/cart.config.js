function CartConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.cart', {
          url: '/cart',
          controller: 'CartCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'cart/cart.html',
          title: 'Cart',
          resolve: {
            shippingSettings: function(SettingsService, $state) {
              return SettingsService.getShippingSettings()
                .then((data) => {
                    return data;
              }, () => {
                $state.go();
              });
            }
          }
        })
  };
  
  export default CartConfig;