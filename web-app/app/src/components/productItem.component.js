export default class ProductItemController {
    constructor($scope,  CartService) {
        'ngInject';

        this.$scope = $scope;
        this.CartService = CartService;

        this.product = this.$scope.$parent.product;
        console.log(this.product);
    }

    addToCart() {
        console.log('click');
        this.CartService.addItemToCart(this.product);
    }
}
