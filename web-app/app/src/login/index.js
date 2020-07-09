import LoginConfig from './login.config';
import LoginCtrl from './login.controller';

// Create the module where our functionality can attach to
let loginModule = angular.module('app.login', []);

// Include our UI-Router config settings
loginModule.config(LoginConfig);

// Controllers
loginModule.controller('LoginCtrl', LoginCtrl);

export default loginModule;
