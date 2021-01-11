class RegisterCtrl {
    constructor(AppConstants, UserService, AuthenticationService, $state, $timeout, $location, $rootScope) {
      'ngInject';
  
      this.appName = AppConstants.appName;

      this.user = {prefix: 'M.'};
      this.UserService = UserService;
      this.AuthenticationService = AuthenticationService;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$location = $location;
      this.$rootScope = $rootScope;
      this.errorMessage = null;
  
    }

    $onInit() {
      this.AuthenticationService.clearCredentials();
      this.$rootScope.$broadcast('userLoggedOut');
      
      const nextObj = this.$location.search();
      if (nextObj && nextObj.next) {
        this.next = `/${nextObj.next}`;
      }
    }

    register() {
      const user = {
        prefix: this.user.prefix,
        name: this.user.name,
        email: this.user.email,
        phone: `+216${this.user.phone}`,
        mf: this.user.mf,
        password: sha3_256(this.user.password)
      };
      this.UserService.create(user)
        .then((result) => {
          const email = result.data.email;
          const password = result.data.password;
          this.AuthenticationService.login(email, password)
            .then((response) => {
              if (response.status === 200 && response.data && response.data.token ) {
                this.AuthenticationService.setCredentials(response.data);
                this.$rootScope.$broadcast('userLoggedIn');
                this.$timeout(() => {
                  if (this.next) {
                    this.$location.search({});
                    this.$location.path(this.next);
                  } else {
                    this.$location.path('#!/');
                  }
                });
              }
            }, () => {
              this.$location.path('/login');
            });
        }, (error) => {
          if (error && error.data.kind === 'email_not_available') {
            this.errorMessage = 'L\'adresse email est déjà utilisée, veuillez en choisir une autre ou vous inscrire';
            this.$timeout(() => {
              this.errorMessage = null;
            }, 3000);
          }
        });
    }
      
  }
  
  export default RegisterCtrl;