export default class ProductPreviewController {
    constructor($scope, $mdDialog) {
        'ngInject';

        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$scope.form = {
            quantity: 1
        }
        
    }
}