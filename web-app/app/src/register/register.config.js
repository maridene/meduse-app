  function RegisterConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.register', {
          url: '/register',
          controller: 'RegisterCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'register/register.html',
          data: {
            meta: {
                title: 'Inscription'
            }
        }
        });
  
  };

  export default RegisterConfig;