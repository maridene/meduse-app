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

    addAddress(data) {
        const deferred = this.$q.defer();
        this.RestService.post(`${ApiConstants.ADDRESSES}`, data)
            .then((result) => {
                deferred.resolve(result);
            }, (error) => deferred.reject(error));
        return deferred.promise; 
    }

    removeAddress(id) {
        const deferred = this.$q.defer();
        this.RestService.delete(`${ApiConstants.ADDRESSES}${id}`)
            .then((result) => {
                deferred.resolve(result);
            }, (error) => deferred.reject(error));
        return deferred.promise; 
    }

    updateAddress() {

    }

}