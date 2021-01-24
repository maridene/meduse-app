import { $q } from "angular-ui-router";

function ProfileConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.profile', {
          url: '/profile',
          controller: 'ProfileCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/profile.html',
          data: {
            meta: {
              'title': 'Profile'
            }
          },
        })
        .state('app.profileinfos', {
          url: '/profile/details',
          controller: 'ProfileDetailsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/infos.html',
          data: {
            meta: {
              'title': 'Informations personnelles'
            }
          },
          resolve: {
            user: function(UserService, $state) {              
              return UserService.mySelf()
              .then((user) => user,
                () => $state.go('app.home'));
            }
          }
        })
        .state('app.profileadresses', {
          url: '/profile/adresses',
          controller: 'ProfileAdressesCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/adresses.html',
          data: {
            meta: {
              'title': 'Mes adresses de livraison'
            }
          },
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
          data: {
            meta: {
              'title': 'Mes commandes'
            }
          },
        })
        .state('app.profileOrderDetails', {
          url: '/profile/order/details/:id',
          controller: 'ProfileOrderDetailsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/orderDetails.html',
          data: {
            meta: {
              'title': 'Détails de la commande'
            }
          },
          resolve: {
            orderData: function(OrdersService, $state, $stateParams) {
              return OrdersService.getById($stateParams.id)
                .then((orderDetails) => {
                  return orderDetails;
                }, () => $state.go('app.profileorders'))
            }
          }
        })
        .state('app.profilepoints', {
          url: '/profile/points',
          controller: 'ProfilePointsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/points.html',
          data: {
            meta: {
              'title': 'Mes points de fidélité'
            }
          },
          resolve: {
            data: function(UserService, $state, $rootScope) {
              if ($rootScope.globals && $rootScope.globals.currentUser) {
                return UserService.mySelf()
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
          data: {
            meta: {
              'title': 'Ajouter une adresse'
            }
          },
        })
        .state('app.editAddress', {
          url: '/profile/adresses/edit/:id',
          controller: 'EditAddressCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'profile/editAddressForm.html',
          data: {
            meta: {
              'title': 'Modifier une aadresse'
            }
          },
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