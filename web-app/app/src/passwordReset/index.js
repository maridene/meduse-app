import PasswordResetConfig from './passwordReset.config';
import PasswordResetCtrl from './passwordReset.controller';

// Create the module where our functionality can attach to
let passwordResetModule = angular.module('app.passwordReset', []);

// Include our UI-Router config settings
passwordResetModule.config(PasswordResetConfig);

// Controllers
passwordResetModule.controller('PasswordResetCtrl', PasswordResetCtrl);

export default passwordResetModule;