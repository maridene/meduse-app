function ConditionsConfig($stateProvider) {
    'ngInject';
  
    $stateProvider
        .state('app.conditions', {
          url: '/conditions-d-utilisation',
          controller: 'ConditionsCtrl',
          controllerAs: '$ctrl',
          templateUrl: 'conditions/conditions.html',
          title: 'Conditions d\'utilisation'
    });
  
};

export default ConditionsConfig;
