function AppRun($rootScope, $location, $cookies, $http, CartService, ngMeta) {
  'ngInject';

  ngMeta.init();

  $rootScope.$on('$locationChangeSuccess', function () {
    window.scrollTo(0, 0);
  });

  // keep user logged in after page refresh
  $rootScope.globals = $cookies.getObject('globals') || {};
  if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.token;
      $http.defaults.headers.common['userId'] = $rootScope.globals.currentUser.id;
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      const restrictedPages = ['/profile', '/profile/details', '/profile/adresses', '/profile/orders', '/profile/points', '/checkout'];
      const isInRestrictedPage = restrictedPages.includes($location.path());
      const loggedIn = $rootScope.globals.currentUser;
      if (isInRestrictedPage && !loggedIn) {
          $location.path('/login');
      }
  });

  //init cart
  CartService.init();

}

export default AppRun;