import { ApiConstants } from '../config/app.constants';

export default class AuthenticationService {
    constructor($http, $cookies, $rootScope, UserService, RestService) {
        'ngInject';

        this.$http = $http;
        this.$cookies = $cookies;
        this.$rootScope = $rootScope;
        this.UserService = UserService;
        this.RestService = RestService;
    }

    login(email, password) {
        return this.RestService.post(ApiConstants.USERS_AUTHENTICATE, {email: email, password: password});
    }

    setCredentials(user) {
        this.$rootScope.globals = {
            currentUser: user
        };

        // set default auth header for http requests
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
        this.$http.defaults.headers.common['userId'] = user.id;

        // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
        const cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        this.$cookies.putObject('globals', this.$rootScope.globals, { expires: cookieExp });
    }

    clearCredentials() {
        this.$rootScope.globals = {};
        this.$cookies.remove('globals');
        this.$http.defaults.headers.common.Authorization = 'Basic';
    }

    updateUserInfo(user) {
        this.$rootScope.globals.currentUser = Object
            .assign({}, this.$rootScope.globals.currentUser, user);
        this.$cookies.remove('globals');
        const cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        this.$cookies.putObject('globals', this.$rootScope.globals, { expires: cookieExp });
        this.$rootScope.$broadcast('userInfoUpdated');
    }

    isAuthenticated () {
        return this.$rootScope.globals && this.$rootScope.globals.currentUser;
    }

    isPremium() {
        return this.isAuthenticated() && !!this.$rootScope.globals.currentUser.premium;
    }
    
}