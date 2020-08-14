class AppHeaderCtrl {
  constructor(AppConstants, CategoryService, $rootScope, $scope, CartService) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.categoryService = CategoryService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.CartService = CartService;

    this.categories = [];
    this.currentUser = this.$rootScope.globals && this.$rootScope.globals.currentUser ? 
      this.$rootScope.globals.currentUser.data : null;
      console.log(this.currentUser);
    this.initCategories();
    this.cart = this.CartService.getCart();

    this.$rootScope.$on('cartUpdated', () => {
      this.cart = this.CartService.getCart();
    });
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