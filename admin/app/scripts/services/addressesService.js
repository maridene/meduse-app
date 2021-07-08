'use strict';

angular.module('sbAdminApp').service('AddressService', ['$q', 'ObjectBuilder', 'RestService', function ($q, ObjectBuilder, RestService) {
    var ADDRESSES = 'addresses';

    function addAddress(address) {
        var deferred = $q.defer();
        RestService.post(ADDRESSES + '/save', address).then(function (result) {
            deferred.resolve(ObjectBuilder.buildObject('address', result.data));
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    function removeAddress(id) {
    }

    function updateAddress(address) {
    }

    function getAddressByClientId(id) {
    }

    return {
        add: addAddress,
        remove: removeAddress,
        update: updateAddress,
        getByClientId: getAddressByClientId
    }
}]);