import { EnrichOrder, orderSorterByStatusASC, orderStatusMapper, getFirstImageFromArray } from "../utils";

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
  constructor(AppConstants, UserService, AuthenticationService, $location, user) {
    'ngInject';

    this.appName = AppConstants.appName;
    this.UserService = UserService;
    this.AuthenticationService = AuthenticationService;
    this.$location = $location;
    this.passwordRepeat = '';
    this.originalUser = user;
  }

  $onInit() {
    this.form = {
      prefix: this.originalUser.prefix,
      name: this.originalUser.name,
      phone: this.originalUser.phone && this.originalUser.phone.indexOf('+216') !== -1 ? this.originalUser.phone.replace('+216', '') : this.originalUser.phone,
      phone2: this.originalUser.phone2 && this.originalUser.phone2.indexOf('+216') !== -1 ? this.originalUser.phone2.replace('+216', '') : this.originalUser.phone2,
      mf: this.originalUser.mf,
      password: ''
    };
  }

  save() {
    const userForm = Object.assign({}, this.form, 
      {
        phone: `+216${this.form.phone}`,
        phone2: `+216${this.form.phone2}`,
        password: sha3_256(this.form.password)
      });
    this.UserService.update(userForm)
      .then((result) => {
        this.AuthenticationService.updateUserInfo(result.data);
        this.$location.path('#!/profile');
      }, (error) => {
        console.log(error);
      });
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

export class ProfileOrderDetailsCtrl {
  constructor(AppConstants, OrdersService, orderData) {
    'ngInject';
    this.appName = AppConstants.appName;
    this.OrdersService = OrdersService;
    this.orderData = orderData;
    this.order = {};
  }

  $onInit() {
    const shipping = this.orderData.totalInfos.lines && this.orderData.totalInfos.lines.some((line) => line.label === 'Livraison') ?
      this.orderData.totalInfos.lines.filter((line) => line.label === 'Livraison')[0].priceTTC : 0;
    const shippingText = shipping ? `${this.orderData.totalInfos.lines.filter((line) => line.label === 'Livraison')[0].priceTTC.toFixed(3)} D.T` : 'Livraison gratuite';
    const sTotal = shipping ? this.orderData.totalInfos.totalInfos.totalTTC - shipping : this.orderData.totalInfos.totalInfos.totalTTC;
    const sTotalText = `${sTotal.toFixed(3)} D.T TTC`;  
    this.order = {
      ref: this.orderData.order.order_ref,
      date: new Date(this.orderData.order.order_date).toLocaleDateString("fr-FR"),
      shippingDate: this.orderData.order.shipping_date ? new Date(this.orderData.order.shipping_date).toLocaleDateString("fr-FR") : null,
      productsCount: this.orderData.rowsDetails.length,
      total: this.orderData.totalInfos.totalInfos.totalLabel,
      reduction: this.orderData.totalInfos.reduction ? this.orderData.totalInfos.reduction.toFixed(3) : null, 
      rows: this.orderData.rowsDetails.map((row) => {
        let price, originalPrice, promo;
        if (row.price) {
          price = row.price;
          originalPrice = row.original_price;
          promo = price !== originalPrice;
        } else {
          price = row.product.promo_price ? row.product.promo_price : row.product.price;
          originalPrice = row.product.price;
          promo = price !== originalPrice;
        }

        let productLabel;
        if (row.variant) {
          if (row.variant.size && row.product.color) {
            productLabel = ` ${row.product.label} - ${row.variant.color} - ${row.product.size}`;
          } else if (row.variant.color) {
            productLabel = ` ${row.product.label} - ${row.variant.color}`;
          } else if (row.variant.size) {
            productLabel = ` ${row.product.label} - ${row.product.size}`;
          } else {
            productLabel = row.product.label;
          }
        } else {
          productLabel = row.product.label;
        }
        

        return {
          product: row.product,
          quantity: row.quantity,
          image: getFirstImageFromArray(row.product.images),
          price,
          originalPrice,
          promo,
          productLabel
        }
      }),
      sTotal: sTotalText,
      shippingFee: shippingText,
      status: orderStatusMapper(this.orderData.order.order_status),
      clientName: '',
      shippingAddress: this.orderData.deliveryAddress.address,
      shippingCity: this.orderData.deliveryAddress.city,
      shippingZipcode: this.orderData.deliveryAddress.zipcode,
      shippingState: this.orderData.deliveryAddress.state
    };
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

export class EditAddressCtrl {
  constructor(AppConstants, $location, AddressesService, data) {
    'ngInject';
    this.appName = AppConstants.appName;
    this.$location = $location;
    this.AddressesService = AddressesService;

    this.states = [
      'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba', 'Kairouan', 'Kasserine', 'Kébili', 'Le Kef',
      'Mahdia', 'La Manouba', 'Mèdenine', 'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine', 
      'Touzeur', 'Tunis', 'Zaghouan'];

    this.form = {
      address: data.address,
      zipcode: data.zipcode,
      city: data.city,
      state: data.state,
      phone: data.phone && data.phone.indexOf('+216') !== -1 ? data.phone.replace('+216', '') : data.phone,
      description: data.description,
      name: data.name
    };

    this.id = data.id;

    const nextObj = this.$location.search();
    if (nextObj && nextObj.next) {
      this.next = `/${nextObj.next}`;
    }
  }

  update() {
    this.AddressesService.updateById(this.id, this.form)
      .then(() => {
        if (this.next) {
          this.$location.path(this.next);
        } else {
          this.$location.path('/profile/adresses');
        }
      })
  }
}
