import PremiumnConfig from './premium.config';
import PremiumCtrl from './premium.controller';

// Create the module where our functionality can attach to
let premiumModule = angular.module('app.premium', []);

// Include our UI-Router config settings
premiumModule.config(PremiumnConfig);

// Controllers
premiumModule.controller('PremiumCtrl', PremiumCtrl);

export default premiumModule;
