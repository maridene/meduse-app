function PremiumConfig($stateProvider) {
  'ngInject';

  $stateProvider
      .state('app.premium', {
        url: '/premium',
        controller: 'PremiumCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'premium/premium.html',
        title: 'Premium'
      });

};

export default PremiumConfig;