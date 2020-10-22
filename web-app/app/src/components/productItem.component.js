
export default class ProductItemController {
    constructor($scope, CartService, $mdDialog, ProductService, AppConstants) {
        'ngInject';

        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.CartService = CartService;
        this.ProductService = ProductService;

        this.product = this.$scope.$parent.product;
        this.variants = [];
        this.image = this.product.images && this.product.images.length ? 
            `${AppConstants.productsStaticContentUrl}${this.product.images.split(',')[0]}` : null;
        
    }

    $onInit() {
        this.ProductService.getProductVariants(this.product.id)
            .then((variants) => this.variants = variants);
    }

    addToCart() {
        this.CartService.addItemToCart(this.product, 1);
    }

    openPreviewPopup(event) {
        this.ProductService.getProductById(this.product.id)
            .then((result) => {
                const product = result.product;
                const variants = result.variants;

                this.$mdDialog.show({
                    locals: {data: {product, variants}},
                    templateUrl: 'components/product-preview.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    clickOutsideToClose: true,
                    fullscreen: false,
                    controller: ['$scope', '$timeout', '$mdDialog', 'CartService', 'AppConstants', 'data', 
                    ($scope, $timeout, $mdDialog, CartService, AppConstants, data) => {
                        $scope.product = data.product;
                        $scope.variants = data.variants;
                        $scope.imagesUrls = data.product.images && data.product.images.length ? 
                            data.product.images.split(',').map((img) => `${AppConstants.productsStaticContentUrl}${img}`) : null;
        
                        $scope.form = {
                            quantity: 1,
                            selectedSize: null,
                            selectedColor: null
                        };

                        //setVariants
                        if ($scope.variants && $scope.variants.length) {
                            $scope.hasSizes = $scope.variants.some((item) => item.size && item.size !== '');
                            $scope.hasColors = $scope.variants.some((item) => item.color && item.color !== '');
                            if ($scope.hasColors) {
                                $scope.availableColors = $scope.hasColors ? $scope.variants.map((item) => ({color: item.color, sku: item.sku})) : [];
                                $scope.form.selectedColor = $scope.availableColors[0];
                            }
                            if ($scope.hasSizes) {
                                $scope.availableSizes = $scope.hasSizes ? $scope.variants.map((item) => ({size: item.size, sku: item.sku})) : [];
                                $scope.form.selectedSize = $scope.availableSizes[0];
                            }
                        }

                        $timeout(() => {
                            initProductImagesViewer();
                            initZoom();
                            initThumbClick();
                            initQuantityChooser();
                        });

                        function initProductImagesViewer() {
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
                        }
                        
                        function initZoom() {
                            const prodPic = angular.element(document.querySelector('.product-pic-zoom'));
                            if (prodPic) {
                                prodPic.zoom();
                            }
                        }

                        function initQuantityChooser() {
                            const proQty = angular.element(document.querySelector('.pro-qty'));
                              proQty.prepend('<span class="dec qtybtn">-</span>');
                              proQty.append('<span class="inc qtybtn">+</span>');
                              proQty.on('click', '.qtybtn', function () {
                                  var $button = $(this);
                                  var oldValue = $button.parent().find('input').val();
                                  if ($button.hasClass('inc')) {
                                      var newVal = parseFloat(oldValue) + 1;
                                  } else {
                                      // Don't allow decrementing below 1
                                      if (oldValue > 1) {
                                        var newVal = parseFloat(oldValue) - 1;
                                      } else {
                                          newVal = 1;
                                      }
                                  }
                                  $button.parent().find('input').val(newVal);
                              });
                          }
                        
                        function initThumbClick() {
                            angular.element(document.querySelectorAll('.product-thumbs-track .pt'))
                                .on('click', (evt) => {
                                    angular.element(document.querySelectorAll('.product-thumbs-track .pt')).removeClass('active');
                                    angular.element(evt.currentTarget).addClass('active');
                                    
                                    const imgurl = angular.element(evt.currentTarget).attr('ng-data-imgbigurl');
                                    const bigImg = angular.element(document.querySelector('.product-big-img')).attr('src');
                                    if (imgurl !== bigImg) {
                                        angular.element(document.querySelector('.product-big-img')).attr({src: imgurl});
                                        angular.element(document.querySelector('.zoomImg')).attr({src: imgurl});
                                    }
                                });
                        }
        
                        $scope.addToCart = function() {
                            if ($scope.quantity) {
                                CartService.addItemToCart($scope.product, $scope.quantity);
                            }
                        };
        
                        $scope.hide = function() {
                            $mdDialog.hide();
                        };

                        $scope.selectSize = function (event){
                            angular.element(document.querySelectorAll('.sc-item label')).removeClass('active');
                            angular.element(event.target).addClass('active');
                        }
                    }]
                });
            });
    }
}
