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
    this.categoryLabel = data.categoryLabel;
    this.long_description = data.long_description;
    this.promo_price = data.promo_price;
    this.manufacturerName = data.manufacturerName;
    this.manufacturerId = data.manufacturerId;
    this.weight = data.weight;
    this.images = data.images;
    this.tags = data.tags;
    this.tva = data.tva;
    this.creationDate = data.creationDate;
  }
}

export default Product;