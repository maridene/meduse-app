function LoginConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.login', {
          url: '/login:next?',
          controller: 'LoginCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'login/login.html',
          title: 'Login'
        });
  
  };
  
  export default LoginConfig;