'use strict';

class Address {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId;
    this.city = data.city;
    this.state = data.state;
    this.address = data.address;
    this.description = data.description;
    this.zipcode = data.zipcode;
    this.phone = data.phone;
  }
}

export default Address;