'use strict';

class Order {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.userName = data.userName;
    this.total = data.total;
    this.date = data.date;
    this.addressId = data.addressId;
    this.status = data.status;
  }
}
