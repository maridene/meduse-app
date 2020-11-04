'use strict';

var RESOURCE = {
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
  ORDER: 'order',
  ORDER_ROW: 'orderRow',
  ORDER_ROWS: 'orderRows'
};
angular.module('sbAdminApp').service('ObjectBuilder', [function () {
  function getImageUrlFromProduct(baseUrl, product) {
    return product.imgCount ? "".concat(baseUrl, "images/").concat(product.sku, "-1.jpg") : "".concat(baseUrl, "images/no-image.jpg");
  }

  function getImagesUrlsFromProduct(baseUrl, product) {
    if (product.imgCount) {
      return Array(product.imgCount).fill("".concat(baseUrl, "images/").concat(product.sku)).map(function (item, index) {
        return "".concat(item, "-").concat(index + 1, ".jpg");
      });
    } else {
      return ["".concat(baseUrl, "images/no-image.jpg")];
    }
  }

  function buildCategory(data) {
    return new Category(data);
  }

  function buildCategories(data) {
    return data.map(function (item) {
      return buildCategory(item);
    });
  }

  ;

  function buildProducts(data) {
    return data.map(function (item) {
      return buildProduct(item);
    });
  }

  ;

  function buildProduct(data) {
    return new Product(data);
  }

  ;

  function buildUser(data) {
    return new User(data);
  }

  ;

  function buildUsers(data) {
    return data.map(function (item) {
      return buildUser(item);
    });
  }

  ;

  function buildProductVariant(data) {
    return new ProductVariant(data);
  }

  ;

  function buildProductVariants(data) {
    return data.map(function (item) {
      return buildProductVariant(item);
    });
  }

  ;

  function buildProductItems(data) {
    return data && data.length ? data.map(function (item) {
      return buildProductItem(item);
    }) : [];
  }

  ;

  function buildProductItem(data) {
    var productItem = new Product(data);
    var imgUrl = getImageUrlFromProduct(SERVER_URL + '/', data);
    productItem.imgUrl = imgUrl;
    return productItem;
  }

  ;

  function buildAddress(data) {
    return new Address(data);
  }

  ;

  function buildAddresses(data) {
    return data.map(function (item) {
      return buildAddress(item);
    });
  }

  ;

  function buildManufacturer(data) {
    return new Manufacturer(data);
  }

  ;

  function buildManufacturers(data) {
    return data.map(function (item) {
      return buildManufacturer(item);
    });
  }

  ;

  function buildBlog(data) {
    return new Blog(data);
  }

  ;

  function buildBlogs(data) {
    return data.map(function (item) {
      return buildBlog(item);
    });
  }

  ;

  function buildClients(data) {
    return data.map(function (item) {
      return buildClient(item);
    });
  }

  ;

  function buildClient(data) {
    return new User(data);
  }

  function buildOrders(data) {
    return data.map(function (item) {
      return buildOrder(item);
    });
  }

  function buildOrder(data) {
    return new Order(data);
  }

  function buildOrderRows(data) {
    return data.map(function (item) {
      return buildOrderRow(item);
    });
  }

  function buildOrderRow(data) {
    return new OrderRow(data);
  }

  return {
    buildObject: function buildObject(key, response) {
      switch (key) {
        case RESOURCE.CATEGORY:
          return buildCategory(response);

        case RESOURCE.CATEGORIES:
          return buildCategories(response);

        case RESOURCE.PRODUCTS:
          return buildProducts(response);

        case RESOURCE.PRODUCT:
          return buildProduct(response);

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

        case RESOURCE.ORDERS:
          return buildOrders(response);

        case RESOURCE.ORDER:
          return buildOrder(response);
        
        case RESOURCE.ORDER_ROWS:
          return buildOrderRows(response);

        case RESOURCE.ORDER_ROW:
          return buildOrderRow(response);
      }

      return response;
    }
  };
}]);