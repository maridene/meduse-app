class HomeCtrl {
  constructor(AppConstants, ProductService) {
    'ngInject';

    const newProductsCount = 4;
    this.appName = AppConstants.appName;
    this.ProductService = ProductService;

    this.newProducts = [];
    this.ProductService.getLastNProduct(newProductsCount)
      .then((products) => {
        this.newProducts = products;
      });

    this.ProductService.getPinnedProducts()
    .then((products) => {
      this.pinnedProducts = products;
    });
  }


}

export default HomeCtrl;