class LoginCtrl {
    constructor(AppConstants, UserService, AuthenticationService, $state) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.UserService = UserService;
      this.AuthenticationService = AuthenticationService;
      this.$state = $state;
      this.init();
      this.email = '';
      this.password = '';
    }

    init() {
      this.AuthenticationService.clearCredentials();
    }

    login(email, password) {
      console.log(email);
      console.log(password);
      this.AuthenticationService.login(this.email, this.password)
        .then((response) => {
          console.log(response);
          if (response.status === 200 && response.data && response.data.token ) {
            this.AuthenticationService.setCredentials(this.email, this.password, response.data);
            this.$state.go('app.home');
          } else {
            console.log(response);
          }
        }, (err) => {
          console.error(err);
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