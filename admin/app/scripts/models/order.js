'use strict';

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Order = function Order(order) {
  _classCallCheck(this, Order);

    this.id = order.id;
    this.order_ref = order.order_ref;
    this.client_id = order.client_id;
    this.order_status = order.order_status;
    this.order_date = order.order_date;
    this.shipped_date = order.shipped_date;
    this.canceled_date = order.canceled_date;
    this.client_message = order.client_message;
    this.coupon_id = order.coupon_id;
    this.delivery_address = order.delivery_address;
    this.delivery_zipcode = order.delivery_zipcode;
    this.delivery_state = order.delivery_state;
    this.delivery_city = order.delivery_city;
    this.delivery_phone = order.delivery_phone;
    this.billing_address = order.billing_address;
    this.billing_zipcode = order.billing_zipcode;
    this.billing_state = order.billing_state;
    this.billing_city = order.billing_city;
    this.billing_phone = order.billing_phone;
    this.creator_id = order.creator_id;
    this.ptype = order.ptype;
    this.payment_status = order.payment_status;
    this.clientName = order.name;
    this.reduction = order.reduction;
    this.total = order.total !== null &&  order.total !== undefined ? order.total : null;
    this.agentId = order.agent_id;
    this.agentName = order.agentName;
    this.admin_message = order.admin_message;
};