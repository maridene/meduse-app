function CartConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.cart', {
          url: '/cart',
          controller: 'CartCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'cart/cart.html',
          title: 'Cart'
        });
  
  };
  
  export default CartConfig;