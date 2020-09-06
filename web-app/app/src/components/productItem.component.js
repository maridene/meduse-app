
export default class ProductItemController {
    constructor($scope, CartService, $mdDialog, ProductService) {
        'ngInject';

        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.CartService = CartService;
        this.ProductService = ProductService;

        this.product = this.$scope.$parent.product;        
    }

    addToCart() {
        this.CartService.addItemToCart(this.product, 1);
    }

    openPreviewPopup(event) {
        this.$mdDialog.show({
            locals: {data: {product: this.product, image: this.image}},
            templateUrl: 'components/product-preview.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: false,
            controller: ['$scope', '$mdDialog', 'CartService', 'data', ($scope, $mdDialog, CartService, data) => {
                $scope.product = data.product;
                $scope.image = data.image;

                $scope.quantity = 0;

                $scope.addToCart = function() {
                    if ($scope.quantity) {
                        CartService.addItemToCart($scope.product, $scope.quantity);
                    }
                };

                $scope.hide = function() {
                    $mdDialog.hide();
                };
            }]
        });
    }
}
