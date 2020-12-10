class ContactCtrl {
  constructor(AppConstants) {
    'ngInject';

    this.appName = AppConstants.appName;

  }

  sendMail() {
    console.log('ok');
  }

}

export default ContactCtrl;