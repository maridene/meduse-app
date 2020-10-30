function AppRun(AppConstants, $rootScope, $location, $cookies, $http, CartService) {
  'ngInject';

  // change page title based on state
  $rootScope.$on('$stateChangeSuccess', (event, toState) => {
    $rootScope.setPageTitle(toState.title);
  });

  // Helper method for setting the page's title
  $rootScope.setPageTitle = (title) => {
    $rootScope.pageTitle = '';
    if (title) {
      $rootScope.pageTitle += title;
      $rootScope.pageTitle += ' \u2014 ';
    }
    $rootScope.pageTitle += AppConstants.appName;
  };

  // keep user logged in after page refresh
  $rootScope.globals = $cookies.getObject('globals') || {};
  if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.token;
      $http.defaults.headers.common['userId'] = $rootScope.globals.currentUser.id;
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      const restrictedPages = ['/profile'];
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