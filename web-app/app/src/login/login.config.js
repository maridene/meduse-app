function LoginConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.login', {
          url: '/login:next?',
          controller: 'LoginCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'login/login.html',
          data: {
            meta: {
                title: 'Connexion'
            }
        }
        });
  
  };
  
  export default LoginConfig;