class CategoryCtrl {
  constructor(data, AppConstants, ProductService) {
    'ngInject';

    this.appName = AppConstants.appName;
    this._ProductService = ProductService;
    this.products = data.items;
    this.count = data.count;
    this.categoryId = data.categoryId;
    this.itemsPerPage = 10;
    console.log(this.products);
    this.pages = [...Array(Math.ceil(this.count  / this.itemsPerPage)).keys()];
    console.log(this.pages);
    this.currentPage = 0;
    this.orderBy = 'default';

  }

  loadProducts(page) {
    if (page !== this.currentPage) {
      this._ProductService.getProductsByCategory(this.categoryId, page * this.itemsPerPage, this.itemsPerPage)
        .then((data) => {
          this.products = data.items;
          this.currentPage = page;
        });
    }
  }
}

export default CategoryCtrl;