class HomeCtrl {
  constructor(AppConstants, ProductService, CategoryService, SettingsService, $timeout, $scope, $location) {
    'ngInject';

    const newProductsCount = 4;
    this.AppConstants = AppConstants;
    this.appName = AppConstants.appName;
    this.ProductService = ProductService;
    this.CategoryService = CategoryService;
    this.SettingsService = SettingsService;
    this.$timeout = $timeout;
    this.$scope = $scope;
    this.$location = $location;

    this.searchQuery = '';
    this.foundProducts = [];
    this.newProducts = [];
    this.promoProducts = [];
    this.selectedCategorySearch = 'all';

    this.ProductService.getPinnedProducts()
    .then((products) => {
      const count = products.length - (products.length % 4);
      this.pinnedProducts = products.slice(0, count);
    });

    this.ProductService.getPromoProducts()
      .then((products) => {
        this.promoProducts = products;
      });

    this.ProductService.getNewProducts()
      .then((products) => {
        const count = products.length - (products.length % 4);
        this.newProducts = products.slice(0, count);
      });

    this.SettingsService.getShippingSettings()
      .then((result) => {
        if (result) {
          const shippingFreeFrom = parseInt(result.freeFrom);
          const shippingFree = parseInt(result.free) === 1;
          if (shippingFree) {
            this.shippingFreeFromText = 'Livraison gratuite!';
          } else {
            this.shippingFreeFromText = `Gratuite à partir de ${shippingFreeFrom} dinars`;
          }
        } else {
          this.shippingFreeFromText = 'Gratuite à partir de 50 dinars';
        }
      }, () => {
        this.shippingFreeFromText = 'Gratuite à partir de 50 dinars';
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