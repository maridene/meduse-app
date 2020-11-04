class AppHeaderCtrl {
  constructor(AppConstants, CategoryService, $rootScope, $scope, CartService) {
    'ngInject';

    this.AppConstants = AppConstants;
    this.categoryService = CategoryService;
    this.$rootScope = $rootScope;
    this.$scope = $scope;
    this.CartService = CartService;

    this.categories = [];
    this.currentUser = this.$rootScope.globals && this.$rootScope.globals.currentUser ? 
      this.$rootScope.globals.currentUser : null;
    this.initCategories();
    this.getCart();
  }

  getCart() {
    this.$scope.$evalAsync(() => {
      this.cart = this.CartService.getCart();
      this.cart.total = this.cart.getTotal();
      this.cart.items.map((item) => 
        item.image = item.product.images && item.product.images.length ? 
        `${this.AppConstants.productsStaticContentUrl}${item.product.images.split(',')[0]}` : null);
    });    
  }

  removeItem(cartItem) {
    this.CartService.removeItem(cartItem.product, cartItem.variant);
  }

  $onInit() {
    this.$rootScope.$on('cartUpdated', () => {
      this.getCart();
    });

    this.$rootScope.$on('userLoggedIn', () => {
      this.currentUser = this.$rootScope.globals && this.$rootScope.globals.currentUser ? 
        this.$rootScope.globals.currentUser : null;
    });

    this.$rootScope.$on('userLoggedOut', () => {
      this.currentUser = null;
    });
  }

  initCategories() {
    this.categoryService.getAllCategories()
        .then((categories) => {
          this.categories = categories;
        });
  }
}

let AppHeader = {
  controller: AppHeaderCtrl,
  templateUrl: 'layout/header.html'
};

export default AppHeader;