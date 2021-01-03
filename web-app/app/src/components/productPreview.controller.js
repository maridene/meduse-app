export function ProductPreviewCtrl($scope, $timeout, $mdDialog, CartService, AppConstants, data) {
    $scope.product = data.product;
    $scope.variants = data.variants;
    $scope.imagesUrls = data.product.images && data.product.images.length ?
        data.product.images.split(',').map((img) => `${AppConstants.productsStaticContentUrl}${img}`) : null;
    $scope.outOfStock = $scope.variants.length ? $scope.variants.every((variant) => variant.quantity === 0)
        : $scope.product.quantity === 0;
    $scope.form = {
        quantity: 1,
        selectedSize: null,
        selectedColor: null
    };

    $scope.selectedVariant = null;
    $scope.selectedVariantAvailable = true;

    //setVariants
    if ($scope.variants && $scope.variants.length) {
        $scope.hasSizes = $scope.variants.some((item) => item.size && item.size !== '');
        $scope.hasColors = $scope.variants.some((item) => item.color && item.color !== '');
        if ($scope.hasColors) {
            $scope.availableColors = $scope.variants.filter((item) => item.color && item.color !== '')
                .filter((item, index, self) => index === self.findIndex((t) => t.color === item.color));
            $scope.form.selectedColor = $scope.availableColors[0];
        }
        if ($scope.hasSizes) {
            $scope.availableSizes = $scope.variants.filter((item) => item.size && item.size !== '')
                .filter((item, index, self) => index === self.findIndex((t) => t.size === item.size));
            $scope.form.selectedSize = $scope.availableSizes[0];
        }
    }

    checkAvailability();

    $timeout(() => {
        initProductImagesViewer();
        initZoom();
        initThumbClick();
        initQuantityChooser();
        initSizeSelection();
        initColorChooser();
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
            prodPic.zoom({ magnify: 2 });
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
                $scope.form.quantity = $scope.form.quantity + 1;

            } else {
                // Don't allow decrementing below 1
                if (oldValue > 1) {
                    var newVal = parseFloat(oldValue) - 1;
                    $scope.form.quantity = $scope.form.quantity - 1;
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
                    angular.element(document.querySelector('.product-big-img')).attr({ src: imgurl });
                    angular.element(document.querySelector('.zoomImg')).attr({ src: imgurl });
                }
            });
    }

    function initColorChooser() {
        const selectList = angular.element(document.querySelector('.sorting, .p-show'));
        if (selectList) {
            selectList.niceSelect();
        }
    }

    $scope.addToCart = function () {
        if (!$scope.outOfStock) {
            if ($scope.variants && $scope.variants.length) {
                CartService.addItemToCart($scope.product, $scope.form.quantity, $scope.selectedVariant);
            } else {
                CartService.addItemToCart($scope.product, $scope.form.quantity, null);
            }
        }
    };

    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.selectSize = function (event, size) {
        angular.element(document.querySelectorAll('.sc-item label')).removeClass('active');
        angular.element(event.target).addClass('active');
        $scope.form.selectedSize = size;
        checkAvailability();
    }

    $scope.colorSelected = function () {
        checkAvailability();
    }

    function initSizeSelection() {
        angular.element(document.querySelectorAll('.sc-item label')[0]).addClass('active');
    }

    function checkAvailability() {
        if ($scope.hasColors && $scope.hasSizes) {
            const foundVariants = $scope.variants
                .filter((variant) => variant.color === $scope.form.selectedColor.color && variant.size === $scope.form.selectedSize.size)
                .filter((variant) => variant.quantity);
            $scope.selectedVariant = foundVariants.length ? foundVariants[0] : null;
            $scope.selectedVariantAvailable = !!$scope.selectedVariant;
        } else if ($scope.hasColors) {
            const foundVariants = $scope.variants
                .filter((variant) => variant.color === $scope.form.selectedColor.color && variant.quantity);
            $scope.selectedVariant = foundVariants.length ? foundVariants[0] : null;
            $scope.selectedVariantAvailable = !!$scope.selectedVariant;
        } else if ($scope.hasSizes) {
            const foundVariants = $scope.variants
                .filter((variant) => variant.size === $scope.form.selectedSize.size && variant.quantity);
            $scope.selectedVariant = foundVariants.length ? foundVariants[0] : null;
            $scope.selectedVariantAvailable = !!$scope.selectedVariant;
        } else {
            $scope.selectedVariant = null;
            $scope.selectedVariantAvailable = true;
        }
    }
}