'use strict';

class Product {
  constructor(data) {
    this.id = data.id;
    this.label = data.label;
    this.description = data.description;
    this.price = data.price;
    this.quantity = data.quantity;
    this.video_link = data.video_link;
    this.category_id = data.category_id;
    this.color = data.color;
    this.size = data.size;
    this.promo_price = data.promo_price;
    this.hasColors = data.hasColors;
    this.hasSizes = data.hasSizes;
    this.colors = data.colors;
    this.image = data.image;
  }
}

export default Product;