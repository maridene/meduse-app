class RegisterCtrl {
    constructor(AppConstants, UserService, $state) {
      'ngInject';
  
      this.appName = AppConstants.appName;

      this.user = {};
      this.UserService = UserService;
      this.$state = $state;
  
    }

    register() {
      console.log(this.user);
      if (this.isValid()) {
        const user = {
          name: this.user.name,
          email: this.user.email,
          phone: `+216${this.user.phone}`,
          password: this.user.password
        };
        console.log(user);
        this.UserService.create(user)
          .then((result) => {
            console.log(result);
            this.$state.go('app.login');
          }, () => {

          });
      }
      
    }

    nameValid() {
      return this.user.name.length > 4;
    }

    emailValid() {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(this.user.email).toLowerCase());
    }

    passwordValid() {
      return this.user.password.length >= 8 
      && this.user.passwordRepeat === this.user.password;
    }

    phoneValid() {
      const re = /(?=.{8,})/;
      return re.test(this.user.phone);
    }

    isValid() {
      console.log(this.nameValid(),
      this.emailValid(),
      this.passwordValid(), 
      this.phoneValid());
      return this.nameValid() 
      && this.emailValid()
      && this.passwordValid() 
      && this.phoneValid();
    }
  
  
  }
  
  export default RegisterCtrl;