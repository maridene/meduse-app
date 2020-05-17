class Product {
  constructor(id, label, description, price, quantity, video_link, category_id) {
    this.id = id;
    this.label = label;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.video_link = video_link;
    this.category_id = category_id;
  }
}

export default Product;