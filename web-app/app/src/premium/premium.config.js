function PremiumConfig($stateProvider) {
  'ngInject';

  $stateProvider
      .state('app.premium', {
        url: '/premium',
        controller: 'PremiumCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'premium/premium.html',
        data: {
          meta: {
            'title': 'Premium'
          }
        },
      });

};

export default PremiumConfig;