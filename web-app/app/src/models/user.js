'use strict';

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.points = data.points;
    this.prefix = data.prefix;
    this.premium = data.premium;
    this.creationDate = data.creationDate;
  }
}

export default User;