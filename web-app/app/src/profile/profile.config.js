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
          title: 'Profile',
          resolve : {
            data: function(AddressesService, $state) {
              return AddressesService.getMyAddresses().then((data) => {
                return data;
              }, (error) => {
                $state.go('app.home');
              });
            }
          }
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
        })
        .state('app.addressFrom', {
          url: '/profile/addressForm',
          controller: 'AddressFormCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/addressForm.html',
          title: 'Profile'
        });
  };
  
  export default ProfileConfig;