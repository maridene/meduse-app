import { ApiConstants } from "../config/app.constants";
import { RESOURCE } from "../constants";

export default class SettingsService {
    constructor(RestService, $q) {
        'ngInject';
    
        this.RestService = RestService;
        this.$q = $q;
    }

    getShippingSettings() {
        const deferred = this.$q.defer();
        this.RestService.get(`${ApiConstants.SETTINGS}/type/shipping`)
            .then((result) => {
                const retVal = {};
                result.data.forEach(element => {
                    retVal[element.label] = element.value;
                });

                deferred.resolve(retVal);
            }, (error) => deferred.reject(error));
        return deferred.promise;
    }
}