class ProductCtrl {
  constructor(AppConstants, data, relatedProducts, ProductService, CartService, $timeout, $sce, $rootScope) {
    'ngInject';

    this.$timeout = $timeout;
    this.$sce = $sce;
    this.appName = AppConstants.appName;
    this.ProductService = ProductService;
    this.CartService = CartService;
    this.product = data.product;
    this.productLabelForUrl = this.product.label
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/ /g, '-')
      .replace(/\//g, '-')
      .replace(/%/g, 'p');
    this.variants = data.variants;
    this.relatedProducts = relatedProducts;
    this.$rootScope = $rootScope;

    this.imagesUrls = this.product.images && this.product.images.length ?
      this.product.images.split(',').map((img) => `${AppConstants.productsStaticContentUrl}${img}`) : null;

    this.outOfStock = this.variants && this.variants.length ? this.variants.every((variant) => variant.quantity === 0)
      : this.product.quantity === 0;
    this.form = {
      quantity: 1,
      selectedSize: null,
      selectedColor: null
    };

    this.selectedVariant = null;
    this.selectedVariantAvailable = true;

    //setVariants
    if (this.variants && this.variants.length) {
      this.hasSizes = this.variants.some((item) => item.size && item.size !== '');
      this.hasColors = this.variants.some((item) => item.color && item.color !== '');
      if (this.hasColors) {
        this.availableColors = this.variants.filter((item) => item.color && item.color !== '')
          .filter((item, index, self) => index === self.findIndex((t) => t.color === item.color));
        this.form.selectedColor = this.availableColors[0];
      }
      if (this.hasSizes) {
        this.availableSizes = this.variants.filter((item) => item.size && item.size !== '')
          .filter((item, index, self) => index === self.findIndex((t) => t.size === item.size));
        this.form.selectedSize = this.availableSizes[0];
      }
    }

    //init size and color description texts
    this.AvailableSizesText = this.hasSizes ? this.availableSizes.map((item) => item.size).join(', ') : 'pas de tailles';
    this.AvailableColorsText = this.hasColors ? this.availableColors.map((item) => item.color).join(', ') : 'pas de couleurs';

    this.checkAvailability();
  }

  $onInit() {
    this.$timeout(() => {
      this.initProductImagesViewer();
      this.initZoom();
      this.initThumbClick();
      this.initColorChooser();
      this.initQuantityChooser();
      this.initSizeSelection();
    });
  }

  selectSize(event, size) {
    angular.element(document.querySelectorAll('.sc-item label')).removeClass('active');
    angular.element(event.target).addClass('active');
    this.form.selectedSize = size;
    this.checkAvailability();
  }

  colorSelected() {
    this.checkAvailability();
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

  initSizeSelection () {
    angular.element(document.querySelectorAll('.sc-item label')[0]).addClass('active');
  }

  initQuantityChooser() {
    const proQty = angular.element(document.querySelector('.pro-qty'));
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    let that = this;
    proQty.on('click', '.qtybtn', function () {
      var $button = $(this);
      var oldValue = $button.parent().find('input').val();
      if ($button.hasClass('inc')) {
        var newVal = parseFloat(oldValue) + 1;
        that.form.quantity = that.form.quantity +1;
      } else {
        // Don't allow decrementing below 1
        if (oldValue > 1) {
          var newVal = parseFloat(oldValue) - 1;
          that.form.quantity = that.form.quantity - 1;
        } else {
          newVal = 1;
        }
      }
      $button.parent().find('input').val(newVal);
    });
  }

  initZoom() {
    const prodPic = angular.element(document.querySelector('.product-pic-zoom'));
    if (prodPic) {
      prodPic.zoom({ magnify: 2 });
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
          angular.element(document.querySelector('.product-big-img')).attr({ src: imgurl });
          angular.element(document.querySelector('.zoomImg')).attr({ src: imgurl });
        }
      });
  }

  initColorChooser() {
    const selectList = angular.element(document.querySelector('.sorting, .p-show'));
    if (selectList) {
      selectList.niceSelect();
    }
  }

  checkAvailability() {
    if (this.hasColors && this.hasSizes) {
      const foundVariants = this.variants
        .filter((variant) => variant.color === this.form.selectedColor.color && variant.size === this.form.selectedSize.size)
        .filter((variant) => variant.quantity);
      this.selectedVariant = foundVariants.length ? foundVariants[0] : null;
      this.selectedVariantAvailable = !!this.selectedVariant;
    } else if (this.hasColors) {
      const foundVariants = this.variants
        .filter((variant) => variant.color === this.form.selectedColor.color && variant.quantity);
      this.selectedVariant = foundVariants.length ? foundVariants[0] : null;
      this.selectedVariantAvailable = !!this.selectedVariant;
    } else if (this.hasSizes) {
      const foundVariants = this.variants
        .filter((variant) => variant.size === this.form.selectedSize.size && variant.quantity);
      this.selectedVariant = foundVariants.length ? foundVariants[0] : null;
      this.selectedVariantAvailable = !!this.selectedVariant;
    } else {
      this.selectedVariant = null;
      this.selectedVariantAvailable = true;
    }
  }

  addToCart() {
    if (!this.outOfStock) {
        if (this.variants && this.variants.length) {
            this.CartService.addItemToCart(this.product, this.form.quantity, this.selectedVariant);
        } else {
            this.CartService.addItemToCart(this.product, this.form.quantity, null);
        }
    }
  }

  trust(src) {
    return this.$sce.trustAsResourceUrl(src);
  }

  share() {
    FB.ui(
      {
          method: 'feed',
          name: this.product.label,
          link: 'https://www.meduse.tn/product/'+ this.product.id + '-' + this.productLabelForUrl,
          picture: this.imagesUrls && this.imagesUrls.length ? this.imagesUrls[0] : undefined,
          caption: 'Meduse.tn',
          description: this.product.description,
          message: ''
      });
  }
}

export default ProductCtrl;