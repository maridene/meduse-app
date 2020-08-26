class ProductCtrl {
  constructor(AppConstants, data, ProductService) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.ProductService = ProductService;
    this.product = data.product;
    this.variants = data.variants;
    this.productImages = data.images;
  }


}

export default ProductCtrl;