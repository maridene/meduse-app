class PasswordResetCtrl {
    constructor(AppConstants, UserService) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.email = '';
      this.done = false;
      this.userService = UserService;
    }

    submit() {
        if (this.email) {
            this.userService.resetPassword(this.email)
                .finally(() => {
                    this.done = true;
                });
        }
    }
  }
  
  export default PasswordResetCtrl;