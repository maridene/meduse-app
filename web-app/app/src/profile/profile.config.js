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
          title: 'Profile',
          resolve: {
            data: function(UserService, $state, $rootScope) {
              if ($rootScope.globals && $rootScope.globals.currentUser) {
                return UserService.getById($rootScope.globals.currentUser.id)
                  .then((data) => {
                    return data;
                  }, (error) => {
                    $state.go('app.home');
                  })
              } else {
                $state.go('app.home');
              }
            },
            coupons : function(CouponsService, $state, $rootScope) {
              if ($rootScope.globals && $rootScope.globals.currentUser) {
                return CouponsService.getMyCoupons($rootScope.globals.currentUser.id)
                  .then((data) => {
                    return data;
                  }, (error) => {
                    $state.go('app.home');
                  })
              } else {
                $state.go('app.home');
              }
            }
          }
        })
        .state('app.addressFrom', {
          url: '/profile/addressForm',
          controller: 'AddressFormCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/addressForm.html',
          title: 'Profile'
        })
        .state('app.editAddress', {
          url: '/profile/adresses/edit/:id',
          controller: 'EditAddressCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/editAddressForm.html',
          title: 'Profile',
          resolve: {
            data: function(AddressesService, $state, $stateParams) {
              return AddressesService.getById($stateParams.id).then(
                  (data) => {
                    return data;
                  },
                  (err) => $state.go('app.home')
              )
            }
          }
        });
  };
  
  export default ProfileConfig;