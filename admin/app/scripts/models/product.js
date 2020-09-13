'use strict';

class Product {
  constructor(data) {
    this.id = data.id;
    this.sku = data.sku;
    this.label = data.label;
    this.description = data.description;
    this.price = data.price;
    this.quantity = data.quantity;
    this.video_link = data.video_link;
    this.category_id = data.category_id;
    this.long_description = data.long_description;
    this.promo_price = data.promo_price;
    this.manufacturer = data.manufacturer;
    this.weight = data.weight;
    this.imgCount = data.imgCount;
  }
}
