'use strict';

const RESOURCE = {
  CATEGORY: 'category',
  CATEGORIES: 'categories',
  PRODUCT: 'product',
  PRODUCTS: 'products',
  USERS: 'users',
  USER: 'user',
  PRODUCT_VARIANT: 'product_variant',
  PRODUCT_VARIANTS: 'product_variants',
  PRODUCT_ITEMS: 'product_items',
  PRODUCT_ITEM: 'product_item',
  ADDRESS: 'address',
  ADDRESSES: 'addresses',
  MANUFACTURER: 'manufacturer',
  MANUFACTURERS: 'manufacturers',
  BLOGS: 'blogs',
  BLOG: 'blog',
  CLIENTS: 'clients',
  CLIENT: 'client',
  ORDERS: 'orders',
  ORDER: 'order'
};

angular.module('sbAdminApp')
  .service('ObjectBuilder', [function() {

    function getImageUrlFromProduct(baseUrl, product) {
      return product.imgCount ? `${baseUrl}images/${product.sku}-1.jpg` : `${baseUrl}images/no-image.jpg`;
    }
  
    function getImagesUrlsFromProduct(baseUrl, product) {
      if (product.imgCount) {
          return Array(product.imgCount).fill(`${baseUrl}images/${product.sku}`).map((item, index) => `${item}-${index+1}.jpg`);
      } else {
          return [`${baseUrl}images/no-image.jpg`];
      }
    }
    function buildCategory(data) {
      return new Category(data);
    }
    function buildCategories(data) {
      return data.map((item) => buildCategory(item));
    };
    function buildProducts(data) {
      return data.map((item) => buildProduct(item));
    };
    function buildProduct(data) {
      return new Product(data);
    };
    function buildUser(data) {
      return new User(data.id, data.name, data.email, data.phone);
    };
    function buildUsers(data) {
      return data.map((item) => buildUser(item));
    };
    function buildProductVariant(data) {
      return new ProductVariant(data);
    };
    function buildProductVariants(data) {
      return data.map((item) => buildProductVariant(item));
    };
    function buildProductItems(data) {
      return data && data.length ? data.map((item) => buildProductItem(item)) : [];
    };
    function buildProductItem(data) {
      const productItem = new Product(data);
      const imgUrl = getImageUrlFromProduct('http://localhost:3000/', data); 
      productItem.imgUrl = imgUrl;
      return productItem;
    };
    function buildAddress(data) {
      return new Address(data);
    };
    function buildAddresses(data) {
      return data.map((item) => buildAddress(item));
    };
    function buildManufacturer(data) {
      return new Manufacturer(data);
    };
    function buildManufacturers(data) {
      return data.map((item) => buildManufacturer(item));
    };
    function buildBlog(data) {
      return new Blog(data);
    };
    function buildBlogs(data) {
      return data.map((item) => buildBlog(item));
    };
    function buildClient(data) {
      return data.map((item) => buidClient(item));
    };
    function buildClients(data) {
      return new Client(data);
    };
    function buildOrders(data) {
      return data.map((item) => buidOrder(item));
    };
    function buildOrder(data) {
      return new Order(data);
    };

    return {
      buildObject(key, response) {
        switch(key){
          case RESOURCE.CATEGORY:
            return buildCategory(response);
          case RESOURCE.CATEGORIES:
            return buildCategories(response);
          case RESOURCE.PRODUCTS:
            return buildProducts(response)
          case RESOURCE.PRODUCT:
            return buildProduct(response)
          case RESOURCE.USER:
            return buildUser(response);
          case RESOURCE.USERS:
            return buildUsers(response);
          case RESOURCE.PRODUCT_VARIANTS:
            return buildProductVariants(response);
          case RESOURCE.PRODUCT_VARIANT:
            return buildProductVariant(response);
          case RESOURCE.PRODUCT_ITEMS:
            return buildProductItems(response);
          case RESOURCE.PRODUCT_ITEM:
            return buildProductItem(response);
          case RESOURCE.ADDRESS:
            return buildAddress(response);
          case RESOURCE.ADDRESSES:
            return buildAddresses(response);
          case RESOURCE.MANUFACTURER:
            return buildManufacturer(response);
          case RESOURCE.MANUFACTURERS:
            return buildManufacturers(response);
          case RESOURCE.BLOGS:
            return buildBlogs(response);
          case RESOURCE.BLOG:
            return buildBlog(response);
          case RESOURCE.CLIENTS:
            return buildClients(response);
          case RESOURCE.CLIENT:
            return buildClient(response);
          case RESOURCE.Orders:
            return buildOrders(response);
          case RESOURCE.Order:
            return buildOrder(response);

        }
        return response;
      }
    }
  }]);