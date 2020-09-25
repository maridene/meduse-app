'use strict';

class Product {
  constructor(data) {
    this.id = data.id;
    this.sku = data.sku;
    this.label = data.label;
    this.description = data.description;
    this.lowStockThreshold = data.lowStockThreshold;
    this.price = data.price;
    this.quantity = data.quantity;
    this.video_link = data.video_link;
    this.category_id = data.category_id;
    this.category = data.category;
    this.long_description = data.long_description;
    this.promo_price = data.promo_price;
    this.manufacturerId = data.manufacturerId;
    this.manufacturerName = data.manufacturerName;
    this.weight = data.weight;
    this.images = data.images;
  }
}
