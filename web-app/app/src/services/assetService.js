import { ApiConstants } from "../config/app.constants";

export default class AssetService {
    constructor(RestService, $q, ObjectBuilder) {
        'ngInject';
    
        this.RestService = RestService;
        this.$q = $q;
        this.ObjectBuilder = ObjectBuilder;
    }

    getMainAssetForProduct(productRef) {
        const deferred = this.$q.defer();
        this.RestService.get(ApiConstants.MAIN_ASSET_FOR_PRODUCT.replace('{0}', productRef))
            .then((result) => deferred.resolve(result),
            (error) => deferred.reject(error));
        return deferred.promise;
    }

    getAssetsForProduct() {

    }
}