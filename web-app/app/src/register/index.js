import RegisterConfig from './register.config';
import RegisterCtrl from './register.controller';

// Create the module where our functionality can attach to
let registerModule = angular.module('app.register', ['app.services']);

// Include our UI-Router config settings
registerModule.config(RegisterConfig);

// Controllers
registerModule.controller('RegisterCtrl', RegisterCtrl);

export default registerModule;