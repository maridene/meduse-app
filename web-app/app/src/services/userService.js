import { ApiConstants } from '../config/app.constants';
import { RESOURCE } from '../constants';

export default class UserService {
    constructor(RestService, $q, ObjectBuilder) {
        'ngInject';

        this.RestService = RestService;
        this.$q = $q;
        this.ObjectBuilder = ObjectBuilder;
        this.currentUser = null;
    }

    currentUser() {
        return this.currentUser;
    }

    setCurrentUser(user) {
        this.currentUser = user;
    }

    isCurrentUserAdmin() {
        return this.currentUser && this.currentUser.role === 'Admin';
    }

    getAll() {
        const deferred = this.$q.defer();
        this.RestService.get(ApiConstants.USERS)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.USERS, result.data)),
            (error) => deferred.reject(error)
        );
        return deferred.promise;
    }

    getById(id) {
        const deferred = this.$q.defer();
        this.RestService.get(`${ApiConstants.USERS}`/`${id}`)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.USER, result.data)),
            (error) => deferred.reject(error));
        return deferred.promise;
    }

    getByEmail(email) {
        const deferred = this.$q.defer();
        this.RestService.get(`${ApiConstants.USERS}`/`${email}`)
        .then(
            (result) => deferred.resolve(this.ObjectBuilder.buildObject(RESOURCE.USER, result.data)),
            (error) => deferred.reject(error));
        return deferred.promise;
    }

    create(user) {
        const deferred = this.$q.defer();
        this.RestService.post(ApiConstants.USERS_REGISTER, user)
        .then((user) => {
            deferred.resolve(user);
        }, (error) => {
            deferred.reject(error);
        });
        return deferred.promise;
    }

    update(user) {
        const deferred = this.$q.defer();
        console.log(`${ApiConstants.USERS_UPDATE}${user.id}`);
        this.RestService.put(`${ApiConstants.USERS_UPDATE}${user.id}`, user)
            .then((user) => {
                deferred.resolve(user);
            }, (error) => {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    delete(id) {
        const deferred = this.$q.defer();
        return this.$http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        return deferred.promise;
    }

}