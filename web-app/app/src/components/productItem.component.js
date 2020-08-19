export default class ProductItemController {
    constructor($scope,  CartService) {
        'ngInject';

        this.$scope = $scope;
        this.CartService = CartService;

        this.product = this.$scope.$parent.product;
        this.image = null;

        if (this.product.image && this.product.image.data) {
            const base64String = btoa(String.fromCharCode(...new Uint8Array(this.product.image.data)));
            this.image = 'data:image/jpg;base64,' + base64String;
            console.log(this.image);
            
        }
        
    }

    addToCart() {
        console.log('click');
        this.CartService.addItemToCart(this.product);
    }
}
