class HomeCtrl {
  constructor(AppConstants, ProductService, CategoryService, $timeout, $scope, $location) {
    'ngInject';

    const newProductsCount = 4;
    this.AppConstants = AppConstants;
    this.appName = AppConstants.appName;
    this.ProductService = ProductService;
    this.CategoryService = CategoryService;
    this.$timeout = $timeout;
    this.$scope = $scope;
    this.$location = $location;

    this.searchQuery = '';
    this.foundProducts = [];
    this.newProducts = [];
    this.selectedCategorySearch = 'all';

    this.ProductService.getLastNProduct(newProductsCount)
      .then((products) => {
        this.newProducts = products;
      });

    this.ProductService.getPinnedProducts()
    .then((products) => {
      this.pinnedProducts = products;
    });
  }

  $onInit() {
    
  }

  search() {
    if (this.searchQuery.length > 2) {
      const container = angular.element(document.querySelector("#searchContainer"));
      if (container) {
        container.css('display', 'block');
      }
      this.ProductService.search(this.searchQuery)
        .then((result) => {
          this.foundProducts = result.map((item) => {
            item.image = item.images && item.images.length ? 
            `${this.AppConstants.productsStaticContentUrl}${item.images.split(',')[0]}` : null;
            return item;
          });
        }, () => {
          this.foundProducts = [];
        });
    } else {
      this.foundProducts = [];
    }
  }

  goToProduct(product) {
    this.$location.path('/product/' + product.id);
  }
}

export default HomeCtrl;