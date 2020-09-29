import { ApiConstants } from '../config/app.constants';

export default class AuthenticationService {
    constructor($http, $cookies, $rootScope, UserService, RestService) {
        'ngInject';

        this.$http = $http;
        this.$cookies = $cookies;
        this.$rootScope = $rootScope;
        this.UserService = UserService;
        this.RestService = RestService;

        // Base64 encoding service used by AuthenticationService
        this.base64 = {
            encode: (input) => {
                const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                let output = "";
                let chr1, chr2, chr3 = "";
                let enc1, enc2, enc3, enc4 = "";
                let i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: (input) => {
                const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
                let output = "";
                let chr1, chr2, chr3 = "";
                let enc1, enc2, enc3, enc4 = "";
                let i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                let base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };
    }

    login(email, password) {
        return this.RestService.post(ApiConstants.USERS_AUTHENTICATE, {email: email, password: password});
    }

    setCredentials(email, password, user) {
        const authdata = this.base64.encode(email + ':' + password);

        this.$rootScope.globals = {
            currentUser: {
                data: user,
                authdata: authdata
            }
        };

        // set default auth header for http requests
        this.$http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;

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

    isAuthenticated () {
        return this.$rootScope.globals && this.$rootScope.globals.currentUser && this.$rootScope.globals.currentUser.data;
    }
    
}