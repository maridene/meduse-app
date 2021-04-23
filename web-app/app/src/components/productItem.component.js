import { ProductPreviewCtrl } from './productPreview.controller';

export default class ProductItemController {
    constructor($scope, CartService, $mdDialog, ProductService, AppConstants) {
        'ngInject';

        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.CartService = CartService;
        this.ProductService = ProductService;

        this.product = this.$scope.$parent.product;
        this.productLabelForUrl = this.product.label
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replaceAll(' ', '-')
            .replaceAll('\'', '-')
            .replace('%', 'p');
        this.href = `product/${this.product.id}-${this.productLabelForUrl}`;
        this.variants = [];
        this.image = this.product.images && this.product.images.length ? 
            `${AppConstants.productsStaticContentUrl}${this.product.images.split(',')[0]}` : null;
        this.outOfStock = false;
        
    }

    $onInit() {
        this.ProductService.getProductVariants(this.product.id)
            .then((variants) => {
                this.variants = variants
                this.outOfStock = this.variants && this.variants.length ? this.variants.every((variant) => variant.quantity < 1)
                    : this.product.quantity < 1;
            }, () => {
                this.outOfStock = this.variants && this.variants.length ? this.variants.every((variant) => variant.quantity < 1)
                    : this.product.quantity < 1;
            });
        
    }

    //single item to add to cart: can have variants. Check on quantity
    addToCart() {
        if (!this.outOfStock) {
            if (this.variants && this.variants.length) {
                this.openPreviewPopup(null);
            } else {
                this.CartService.addItemToCart(this.product, 1, null);
            }
        }
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
                    controller: ['$scope', '$timeout', '$mdDialog', 'CartService', 'AppConstants', 'data', ProductPreviewCtrl]
                });
            });
    }
}
