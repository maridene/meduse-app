class AppHeaderCtrl {
  constructor(AppConstants, CategoryService, $rootScope, $scope) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.categoryService = CategoryService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;

    this.categories = [];
    this.currentUser = this.$rootScope.globals && this.$rootScope.globals.currentUser ? 
      this.$rootScope.globals.currentUser.data : null;
      console.log(this.currentUser);
    this.initCategories();
  }

  initCategories() {
    this.categoryService.getAllCategories()
        .then((categories) => {
          this.categories = categories;
          console.log(this.categories);
        });
  }
}

let AppHeader = {
  controller: AppHeaderCtrl,
  templateUrl: 'layout/header.html'
};

export default AppHeader;