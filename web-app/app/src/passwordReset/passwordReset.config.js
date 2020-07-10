  function PasswordResetConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.passwordReset', {
          url: '/passwordReset',
          controller: 'PasswordResetCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'passwordReset/passwordReset.html',
          title: 'PasswordReset'
        });
  
  };

  export default PasswordResetConfig;