function AppRun(AppConstants, $rootScope, $location, $cookies, $http) {
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
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
  }

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      const restrictedPages = ['/profile', '/cart'];
      const isInRestrictedPage = restrictedPages.includes($location.path());
      const loggedIn = $rootScope.globals.currentUser;
      if (isInRestrictedPage && !loggedIn) {
          $location.path('/login');
      }
  });

}

export default AppRun;