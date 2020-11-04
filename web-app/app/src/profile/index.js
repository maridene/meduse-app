import ProfileConfig from './profile.config';
import { ProfileCtrl, ProfileDetailsCtrl, ProfileAdressesCtrl, ProfileOrdersCtrl, ProfilePointsCtrl, AddressFormCtrl, EditAddressCtrl } from './profile.controller';

// Create the module where our functionality can attach to
let profileModule = angular.module('app.profile', []);

// Include our UI-Router config settings
profileModule.config(ProfileConfig);

// Controllers
profileModule.controller('ProfileCtrl', ProfileCtrl);
profileModule.controller('ProfileDetailsCtrl', ProfileDetailsCtrl);
profileModule.controller('ProfileAdressesCtrl', ProfileAdressesCtrl);
profileModule.controller('ProfileOrdersCtrl', ProfileOrdersCtrl);
profileModule.controller('ProfilePointsCtrl', ProfilePointsCtrl);
profileModule.controller('AddressFormCtrl', AddressFormCtrl);
profileModule.controller('EditAddressCtrl', EditAddressCtrl);

export default profileModule;
