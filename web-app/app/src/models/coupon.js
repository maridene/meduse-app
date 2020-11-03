'use strict';

class Coupon {
  constructor(data) {
    this.id = data.id;
    this.code = data.code;
    this.value = data.value;
    this.client_id = data.client_id;
    this.creation_date = data.creation_date && data.creation_date.length ? data.creation_date.split('T')[0] : '';
  }
}

export default Coupon;