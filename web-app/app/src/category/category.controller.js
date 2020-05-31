class CategoryCtrl {
  constructor(products, AppConstants, ProductService) {
    'ngInject';

    this.appName = AppConstants.appName;
    this._ProductService = ProductService;
    this.products = products;
    console.log(products);

  }
}

export default CategoryCtrl;