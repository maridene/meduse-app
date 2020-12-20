class ContactCtrl {
  constructor(AppConstants, RestService, $timeout) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.RestService = RestService;
    this.state = 'default';
    this.$timeout = $timeout;
  }

  clear() {
    this.senderName = '';
    this.senderEmail = '';
    this.message = '';
  }

  sendMail() {
    //TO DO: Add validation
    const form = {
      senderEmail: this.senderEmail,
      senderName: this.senderName,
      message: this.message
    }

    this.RestService.post('contactform', form)
      .then(() => {
        this.clear();
        this.state = 'sent';
        this.$timeout(() => {
          this.state = 'default';
        }, 3000);
      }, () => {
        this.state = 'error';
        this.$timeout(() => {
          this.state = 'default';
        }, 3000);
      });
  }

}

export default ContactCtrl;