function ProfileConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.profile', {
          url: '/profile',
          controller: 'ProfileCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/profile.html',
          title: 'Profile'
        })
        .state('app.profileinfos', {
          url: '/profile/details',
          controller: 'ProfileDetailsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/infos.html',
          title: 'Profile'
        })
        .state('app.profileadresses', {
          url: '/profile/adresses',
          controller: 'ProfileAdressesCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/adresses.html',
          title: 'Profile'
        })
        .state('app.profileorders', {
          url: '/profile/orders',
          controller: 'ProfileOrdersCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/orders.html',
          title: 'Profile'
        })
        .state('app.profilepoints', {
          url: '/profile/points',
          controller: 'ProfilePointsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/points.html',
          title: 'Profile'
        });
  };
  
  export default ProfileConfig;