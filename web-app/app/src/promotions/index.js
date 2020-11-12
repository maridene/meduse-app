import PromotionsConfig from './promotions.config';
import PromotionsCtrl from './promotions.controller';

// Create the module where our functionality can attach to
let promotionsModule = angular.module('app.promotions', []);

// Include our UI-Router config settings
promotionsModule.config(PromotionsConfig);

// Controllers
promotionsModule.controller('PromotionsCtrl', PromotionsCtrl);

export default promotionsModule;
