'use strict';

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.token = data.token;
    this.creationDate = data.creationDate;
    this.role = data.role;
  }
}
