class AppHeaderCtrl {
  constructor(AppConstants, CategoryService) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.categoryService = CategoryService;

    this.categories = [];
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