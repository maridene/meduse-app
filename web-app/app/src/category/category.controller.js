class CategoryCtrl {
  constructor(data, AppConstants, ProductService, $timeout) {
    'ngInject';

    this.$timeout = $timeout;
    this.appName = AppConstants.appName;
    this._ProductService = ProductService;
    this.products = data.items;
    this.filteredProducts = this.products;
    this.count = data.count;
    this.manufacturers = data.manufacturers;
    this.categoryId = data.categoryId;
    this.categoryName = data.categoryName;
    
    //pagination
    //this.itemsPerPage = 10;
    //this.pages = [...Array(Math.ceil(this.count  / this.itemsPerPage)).keys()];
    //this.currentPage = 0;
    
    //filters
    this.orderBy = 'default';
    this.filterQuery = '';
    this.selectedManufacturerId = 'all';
    this.updateProducts();
  }

  /*
  loadProducts(page) {
    if (page !== this.currentPage) {
      this._ProductService.getProductsByCategory(this.categoryId, page * this.itemsPerPage, this.itemsPerPage)
        .then((data) => {
          this.products = data.items;
          this.currentPage = page;
        });
    }
  }*/

  $onInit() {
    this.$timeout(() => {
      const selectList = angular.element(document.querySelector('.sorting, .p-show'));
      if (selectList) {
        selectList.niceSelect();
      }
    });
  }

  updateProducts() {
    this.filterQueryChanged();
    this.selectedManufacturerChanged();
    this.sortTypeChanged();
  
  }

  filterQueryChanged() {
    this.filteredProducts = this.products.filter((product) => 
      product.label.toLowerCase().includes(this.filterQuery.toLowerCase())
    );
  }

  selectedManufacturerChanged() {
    if (this.selectedManufacturerId !== 'all') {
      this.filteredProducts = this.filteredProducts.filter((product) => product.manufacturerId === this.selectedManufacturerId);
    } else {
      this.filteredProducts = this.filteredProducts;
    }
  }

  sortTypeChanged() {
    switch(this.orderBy) {
      case 'default':
        break;
      case 'priceUp':
        this.filteredProducts = this.filteredProducts.sort((p1, p2) => {
          if (p1.promo_price && p2.promo_price) {
            return p1.promo_price - p2.promo_price;
          } else if (p1.promo_price) {
            return p1.promo_price - p2.price;
          } else if (p2.promo_price) {
            return p1.price - p2.promo_price;
          } else {
            return p1.price - p2.price;
          }
        }); 
        break;
      case 'priceDown':
        this.filteredProducts = this.filteredProducts.sort((p1, p2) => {
          if (p1.promo_price && p2.promo_price) {
            return p2.promo_price - p1.promo_price;
          } else if (p2.promo_price) {
            return p2.promo_price - p1.price;
          } else if (p2.promo_price) {
            return p2.price - p1.promo_price;
          } else {
            return p2.price - p1.price;
          }
        }); 
        break;
      case 'AZ':
        this.filteredProducts = this.filteredProducts.sort((p1, p2) => {
          if (p1.label.toLowerCase() < p2.label.toLowerCase()) {
            return -1;
          }
          if (p1.label.toLowerCase() > p2.label.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        break;
      case 'ZA':
        this.filteredProducts = this.filteredProducts.sort((p1, p2) => {
          if (p1.label.toLowerCase() > p2.label.toLowerCase()) {
            return -1;
          }
          if (p1.label.toLowerCase() < p2.label.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        break;
    }
  }
}

export default CategoryCtrl;