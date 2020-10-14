class ProductCtrl {
  constructor(AppConstants, data, ProductService, $timeout, $sce) {
    'ngInject';

    this.$timeout = $timeout;
    this.$sce = $sce;
    this.appName = AppConstants.appName;
    this.ProductService = ProductService;
    this.product = data.product;
    this.variants = data.variants;
    this.imagesUrls = this.product.images && this.product.images.length ? 
      this.product.images.split(',').map((img) => `${AppConstants.productsStaticContentUrl}${img}`) : null;
    
    this.setVariants();
    this.selectedColor = null;
    this.selectedSize = null;
    this.quantity = 1;
  }

  $onInit() {
    this.$timeout(() => {
      this.initProductImagesViewer();
      this.initZoom();
      this.initThumbClick();
    });
  }

  setVariants() {
    if (this.variants && this.variants.length) {
      this.hasSizes = this.variants.some((item) => item.size && item.size !== '');
      this.hasColors = this.variants.some((item) => item.color && item.color !== '');
      this.availableColors = this.hasColors ? this.variants.map((item) => ({color: item.color, sku: item.sku})) : [];
      this.availableSizes = this.hasSizes ? this.variants.map((item) => ({size: item.size, sku: item.sku})) : [];
      this.AvailableSizesText = this.hasSizes ? this.availableSizes.map((item) => item.size).join(', ') : 'pas de tailles';
      this.AvailableColorsText = this.hasColors ? this.availableColors.map((item) => item.color).join(', ') : 'pas de couleurs';
    }
  }

  selectSize(event) {
    angular.element(document.querySelectorAll('.pd-size-choose .sc-item label')).removeClass('active');
    angular.element(event.target).addClass('active');
  }

  selectColor(event) {

  }

  initProductImagesViewer() {
    const slider = angular.element(document.querySelector('.ps-slider'));
    if (slider) {
      slider.owlCarousel({
          loop: false,
          margin: 10,
          nav: true,
          items: 3,
          dots: false,
          navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
          smartSpeed: 1200,
          autoHeight: false,
          autoplay: false,
          responsive: {
            0: {
                items: 1,
            },
            576: {
                items: 2,
            },
            992: {
                items: 2,
            },
            1200: {
                items: 3,
            }
        }
      });
    }

    const thumbs = angular.element(document.querySelectorAll('.product-thumbs-track .pt'));
    if (thumbs) {
      thumbs.on('click', () => {
        angular.element(document.querySelectorAll('.product-thumbs-track .pt')).removeClass('active');

      });
    }
  }

  initZoom() {
    const prodPic = angular.element(document.querySelector('.product-pic-zoom'));
    if (prodPic) {
      prodPic.zoom();
    }
  }

  initThumbClick() {
    angular.element(document.querySelectorAll('.product-thumbs-track .pt'))
      .on('click', (data) => {
        angular.element(document.querySelectorAll('.product-thumbs-track .pt')).removeClass('active');
        angular.element(event.currentTarget).addClass('active');
      
        const imgurl = angular.element(event.currentTarget).attr('ng-data-imgbigurl');
        const bigImg = angular.element(document.querySelector('.product-big-img')).attr('src');
        if (imgurl !== bigImg) {
          angular.element(document.querySelector('.product-big-img')).attr({src: imgurl});
          angular.element(document.querySelector('.zoomImg')).attr({src: imgurl});
        }
      });
  }

  trust(src) {
    return this.$sce.trustAsResourceUrl(src);
  }
}

export default ProductCtrl;