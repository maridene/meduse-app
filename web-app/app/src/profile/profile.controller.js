export class ProfileCtrl {
    constructor(AppConstants, AuthenticationService, $location, $timeout) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.AuthenticationService = AuthenticationService;
      this.$location = $location;
      this.$timeout = $timeout;
    }

    logout() {
      this.AuthenticationService.clearCredentials();
      this.$timeout(() => {
        this.$location.path('/');
      }, 100);
    }
}

export class ProfileDetailsCtrl {
  constructor(AppConstants, $rootScope, UserService, AuthenticationService, $state) {
    'ngInject';

    this.appName = AppConstants.appName;

    this.user = $rootScope.globals.currentUser.data;
    this.UserService = UserService;
    this.AuthenticationService = AuthenticationService;
    this.$state = $state;

  }

  save() {
    console.log('x');
    if (!this.nameValid()) {
      console.log('a');
    } else if (!this.emailValid()) {
      console.log('b');
    } else if (!this.phoneValid()) {
      console.log('c');
    } else if (!this.passwordValid()) {
      console.log('d');
    } else {
      this.UserService.update(this.user)
        .then((user) => {
          console.log(user);
          if (user) {
            this.AuthenticationService.setCredentials(user.email, user.password, user);
            this.$state.go('app.profile');
          }

        }, (error) => {
          console.log(error);
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


}

export class ProfileAdressesCtrl {
  constructor(AppConstants) {
    'ngInject';

    this.appName = AppConstants.appName;
    

  }
}

export class ProfileOrdersCtrl {
  constructor(AppConstants) {
    'ngInject';

    this.appName = AppConstants.appName;

  }


}

export class ProfilePointsCtrl {
  constructor(AppConstants) {
    'ngInject';

    this.appName = AppConstants.appName;

  }


}