'use strict';

class ProductVariant {
  constructor(data) {
    this.id = data.id;
    this.sku = data.sku;
    this.product_id = data.product_id;
    this.color = data.color;
    this.size = data.size;
    this.quantity = data.quantity;
    this.image = data.image;
  }
}

export default ProductVariant;