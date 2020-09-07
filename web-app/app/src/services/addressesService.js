import { ApiConstants } from "../config/app.constants";
import { RESOURCE } from "../constants";

export default class AddressesService {
    constructor(RestService, $q, ObjectBuilder) {
        'ngInject';
    
        this.RestService = RestService;
        this.$q = $q;
        this.ObjectBuilder = ObjectBuilder;
    }

    getMyAddresses() {
        const deferred = this.$q.defer();
        this.RestService.get(`${ApiConstants.ADDRESSES}myaddresses`)
            .then((result) => {
                deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.ADDRESSES, result.data));
            }, (error) => deferred.reject(error));
        return deferred.promise;
    }

    addAddress() {

    }

    removeAddress() {

    }

    updateAddress() {

    }

}