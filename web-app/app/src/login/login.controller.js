class LoginCtrl {
    constructor(AppConstants, UserService, AuthenticationService, $state, $timeout, $location, $rootScope) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.UserService = UserService;
      this.AuthenticationService = AuthenticationService;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$location = $location;
      this.$rootScope = $rootScope;
      this.init();
      this.email = '';
      this.password = '';
      this.showAlert = false;
    }

    init() {
      this.AuthenticationService.clearCredentials();
      this.$rootScope.$broadcast('userLoggedOut');
    }

    submit() {
      const hashedPassword = sha3_256(this.password);
      this.AuthenticationService.login(this.email, hashedPassword)
        .then((response) => {
          if (response.status === 200 && response.data && response.data.token ) {
            this.AuthenticationService.setCredentials(this.email, this.password, response.data);
            this.$rootScope.$broadcast('userLoggedIn');
            this.$timeout(() => this.$location.path('#!/'));
          } else {
            this.showAlert = true;
            this.$timeout(() => {
              this.showAlert = false;
            }, 3000);
          }
        }, (err) => {
          this.showAlert = true;
            this.$timeout(() => {
              this.showAlert = false;
            }, 3000);
        });
    }

    emailValid() {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.email).toLowerCase());
    }

    passwordValid() {
      return this.password.length >= 8;
    }
  
  
  }
  
  export default LoginCtrl;