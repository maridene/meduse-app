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

    $onInit() {
      const nextObj = this.$location.search();
      if (nextObj && nextObj.next) {
        this.next = `/${nextObj.next}`;
        switch (this.next) {
          case '/checkout':
            this.message = 'Vous devez être connecté à votre compte pour pouvoir passer une commande';
            break;
          default:
            this.message = null;
        }
      } 
    }

    submit() {
      const hashedPassword = sha3_256(this.password);
      this.AuthenticationService.login(this.email, hashedPassword)
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