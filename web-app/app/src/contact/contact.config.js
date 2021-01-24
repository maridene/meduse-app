function ContactConfig($stateProvider) {
  'ngInject';

  $stateProvider
      .state('app.contact', {
        url: '/contact',
        controller: 'ContactCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'contact/contact.html',
        data: {
          meta: {
            'title': 'A Propos'
          }
        },
      });

};

export default ContactConfig;