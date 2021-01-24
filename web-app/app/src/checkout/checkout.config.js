function CheckoutConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.checkout', {
          url: '/checkout',
          controller: 'CheckoutCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'checkout/checkout.html',
          data: {
            meta: {
              'title': 'Commande'
            }
          },
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
        });
  
  };
  
  export default CheckoutConfig;