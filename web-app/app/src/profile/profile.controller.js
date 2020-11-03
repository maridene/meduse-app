import { EnrichOrder, orderSorterByStatusASC } from "../utils";

export class ProfileCtrl {
    constructor(AppConstants, AuthenticationService, $location, $timeout, $rootScope) {
      'ngInject';
  
      this.appName = AppConstants.appName;
      this.AuthenticationService = AuthenticationService;
      this.$location = $location;
      this.$timeout = $timeout;
      this.$rootScope = $rootScope;
    }

    logout() {
      this.AuthenticationService.clearCredentials();
      this.$rootScope.$broadcast('userLoggedOut');
      this.$timeout(() => {
        this.$location.path('/');
      });
    }
}

export class ProfileDetailsCtrl {
  constructor(AppConstants, $rootScope, UserService, AuthenticationService, $state) {
    'ngInject';

    this.appName = AppConstants.appName;

    this.user = $rootScope.globals.currentUser.data;
    this.UserService = UserService;
    this.AuthenticationService = AuthenticationService;
    this.$state = $state;

  }

  save() {
    console.log('x');
    if (!this.nameValid()) {
      console.log('a');
    } else if (!this.emailValid()) {
      console.log('b');
    } else if (!this.phoneValid()) {
      console.log('c');
    } else if (!this.passwordValid()) {
      console.log('d');
    } else {
      this.UserService.update(this.user)
        .then((user) => {
          console.log(user);
          if (user) {
            this.AuthenticationService.setCredentials(user.email, user.password, user);
            this.$state.go('app.profile');
          }

        }, (error) => {
          console.log(error);
        });
    }

  }

  nameValid() {
    return this.user.name.length > 4;
  }

  emailValid() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(this.user.email).toLowerCase());
  }

  passwordValid() {
    return this.user.password.length >= 8 
    && this.user.passwordRepeat === this.user.password;
  }

  phoneValid() {
    const re = /(?=.{8,})/;
    return re.test(this.user.phone);
  }


}

export class ProfileAdressesCtrl {
  constructor(AppConstants, $location, data, AddressesService) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.addresses = data;
    this.$location = $location;
    this.AddressesService = AddressesService;
  }

  addAddress() {
    this.$location.path('/profile/addressForm');
  }

  delete(address) {
    this.AddressesService.removeAddress(address.id)
      .then((result) => {
        this.reloadAddresses();
      });
  }

  reloadAddresses() {
    this.AddressesService.getMyAddresses()
      .then((result) => {
        this.addresses = result;
      })
  }
}

export class ProfileOrdersCtrl {
  constructor(AppConstants, OrdersService) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.OrdersService = OrdersService;
  }

  $onInit() {
    this.OrdersService.getMyOrders()
      .then((orders) => {
        this.orders = orders.map((order) => EnrichOrder(order))
          .sort(orderSorterByStatusASC);
      }, () => {
        this.orders = [];
      });
  }
}

export class ProfilePointsCtrl {
  constructor(AppConstants, data, coupons, CouponsService, $window) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.coupons = coupons;
    this.CouponsService = CouponsService;
    this.$window = $window;
    
    this.defaultPremium = 3000;
    this.points = parseInt(data.points);
    this.premium = data.premium;
    this.remainingPoints = 3000 - this.points;
    this.canGetCoupon = this.points >= 3000;
  }

  getCoupon() {
    if (this.points > this.defaultPremium) {
      this.CouponsService.getCoupon()
        .then(() => {
          this.$window.location.reload(true);
        });
    }
  }
}

export class AddressFormCtrl {
  constructor(AppConstants, $location, AddressesService) {
    'ngInject';
    this.appName = AppConstants.appName;
    this.$location = $location;
    this.AddressesService = AddressesService;

    const nextObj = this.$location.search();
    if (nextObj && nextObj.next) {
      this.next = `/${nextObj.next}`;
    }

    this.states = [
      'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef',
      'Mahdia', 'La Manouba', 'Mèdenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 
      'Touzeur', 'Tunis', 'Zaghouan'];

    this.form = {};
  }

  add() {
    this.form.phone = `+216${this.form.phone}`; 
    this.AddressesService.addAddress(this.form)
      .then((result) => {
        if (result) {
          if (this.next) {
            this.$location.path(this.next);
          } else {
            this.$location.path('/profile/adresses');
          }
        }
      });
  }
}