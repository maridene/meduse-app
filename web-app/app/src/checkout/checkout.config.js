function CheckoutConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.checkout', {
          url: '/checkout',
          controller: 'CheckoutCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'checkout/checkout.html',
          title: 'Checkout'
        });
  
  };
  
  export default CheckoutConfig;