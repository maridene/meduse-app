'use strict';

class Product {
  constructor(id, label, description, price, quantity, video_link, category_id, color, size, promo_price) {
    this.id = id;
    this.label = label;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.video_link = video_link;
    this.category_id = category_id;
    this.color = color;
    this.size = size;
    this.promo_price = promo_price;
  }
}

export default Product;