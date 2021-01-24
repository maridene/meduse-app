function AppConfig($stateProvider, $locationProvider, $urlRouterProvider, ngMetaProvider) {
  'ngInject';

  //$locationProvider.html5Mode(true);

  $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: 'layout/app-view.html'
      });

  $urlRouterProvider.otherwise('/');

  ngMetaProvider.useTitleSuffix(true);
  ngMetaProvider.setDefaultTitle('Meduse');
  ngMetaProvider.setDefaultTitleSuffix(' | Meduse.tn: Medically useful');
  ngMetaProvider.setDefaultTag('author', 'Mohamed Aziz Ridene');

}

export default AppConfig;