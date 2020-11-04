class RegisterCtrl {
    constructor(AppConstants, UserService, $state, $timeout, $location) {
      'ngInject';
  
      this.appName = AppConstants.appName;

      this.user = {prefix: 'M.'};
      this.UserService = UserService;
      this.$state = $state;
      this.$timeout = $timeout;
      this.$location = $location;
      this.errorMessage = null;
  
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
          this.$location.path('/login');
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