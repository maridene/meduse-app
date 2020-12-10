
class AppFooterCtrl {
  constructor(AppConstants, RestService) {
    'ngInject';
    this.appName = AppConstants.appName;
    this.RestService = RestService;

    // Get today's date to generate the year
    this.date = new Date();
  }

  subscribe() {
    this.RestService.post('subscribe', {email: this.email})
      .then(() => {
        this.email = '';
      });
  }
}

let AppFooter = {
  controller: AppFooterCtrl,
  templateUrl: 'layout/footer.html'
};

export default AppFooter;