function HomeConfig($stateProvider) {
  'ngInject';

  $stateProvider
      .state('app.home', {
        url: '/',
        controller: 'HomeCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'home/home.html',
        data: {
          meta: {
            'title': 'Accueil'
          }
        },
      });

};

export default HomeConfig;