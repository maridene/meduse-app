const tables = require('../config/db.tables.js');

function getSearchQuery(searchQuery, params) {
    let query = `SELECT * FROM ${tables.PRODUCTS} WHERE label LIKE '%${searchQuery}%' AND isHidden = 0`;
    if (!params.isPremium) {
        query +=  ' AND isExclusif = 0';
    }
    return query;
}

function findByCategoryQuery(categoryId, params) {
    /*const orderByValues = [
      {key: 'priceUp', value: 'price ASC'},
      {key: 'priceDown', value: 'price DESC'},
      {key: 'AZ', name:'label ASC'},
      {key: 'ZA', value:'label DESC'}
    ];*/
    let productsQuery =`select products.*, M.name AS manufacturerName, C.label AS categoryLabel FROM ${tables.PRODUCTS}
      LEFT JOIN ${tables.MANUFACTURERS} as M
        ON M.id = ${tables.PRODUCTS}.manufacturerId
      LEFT JOIN ${tables.CATEGORIES} as C
        ON C.id = ${tables.PRODUCTS}.category_id
      WHERE (category_id = ${categoryId} OR extendCategories LIKE '%${categoryId}%') AND isHidden = 0`;
    if (!params.isPremium) {
      productsQuery += ' AND isExclusif = 0';
    }
    /*  
    const index = orderByValues.map((item) => item.key).indexOf(orderBy);
    if (index !== -1) {
      productsQuery +=  ` ORDER BY ${orderByValues[index].value}`;
    }
    if (!isNaN(startAt) && !isNaN(maxResult) && startAt >= 0 && maxResult > 0) {
      productsQuery += ` LIMIT ${startAt}, ${maxResult}`;
    }*/
  
    productsQuery += ' ORDER BY orderIndex ASC';
    return productsQuery;
}

function getByCategoryQuery(categoryId) {
    return `select products.*, M.name AS manufacturerName, C.label AS categoryLabel FROM ${tables.PRODUCTS}
        LEFT JOIN ${tables.MANUFACTURERS} as M
        ON M.id = ${tables.PRODUCTS}.manufacturerId
        LEFT JOIN ${tables.CATEGORIES} as C
        ON C.id = ${tables.PRODUCTS}.category_id
        WHERE (category_id = ${categoryId} OR extendCategories LIKE '%${categoryId}%')  ORDER BY orderIndex ASC`;
}

function getByIdQuery(id) {
    return `select products.*, M.name AS manufacturerName, C.label AS categoryLabel FROM ${tables.PRODUCTS}
      LEFT JOIN ${tables.MANUFACTURERS} as M
        ON M.id = ${tables.PRODUCTS}.manufacturerId
      LEFT JOIN ${tables.CATEGORIES} as C
        ON C.id = ${tables.PRODUCTS}.category_id
      WHERE products.id = ${id}`;
}

function findByIdQuery(id, params) {
    let query = `select products.*, M.name AS manufacturerName, C.label AS categoryLabel FROM ${tables.PRODUCTS}
      LEFT JOIN ${tables.MANUFACTURERS} as M
        ON M.id = ${tables.PRODUCTS}.manufacturerId
      LEFT JOIN ${tables.CATEGORIES} as C
        ON C.id = ${tables.PRODUCTS}.category_id
      WHERE products.id = ${id} AND isHidden = 0`;
    if (!params.isPremium) {
        query +=  ' AND isExclusif = 0';
    }
    return query;
}

function countByCategoryQuery(categoryId, params) {
    let query = `SELECT COUNT(*) FROM ${tables.PRODUCTS} WHERE CATEGORY_ID = ${categoryId} AND isHidden = 0`;
    if (!params.isPremium) {
        query += ' AND isExclusif = 0';
    }
    return query;
}

function lastNProductsQuery(n, params) {
    let query = `SELECT * FROM ${tables.PRODUCTS} WHERE isHidden = 0`;
    if (!params.isPremium) {
        query +=  ' AND isExclusif = 0';
    }
    query += ` ORDER BY creationDate DESC LIMIT ${n}`;
    return query;
}

function findInSameCategoryQuery(categoryId, productId,  maxResult, ignoredIds, params) {
    let query;
    if (ignoredIds && ignoredIds.length) {
        query = `SELECT * FROM ${tables.PRODUCTS} WHERE id Not IN (${productId}, ${ignoredIds.join(', ')}) AND category_id = '${categoryId}' AND isHidden = 0`; 
        if (!params.isPremium) {
            query +=  ' AND isExclusif = 0';
        }
        query += ` LIMIT ${maxResult}`;
    
    } else {
        query = `SELECT * FROM ${tables.PRODUCTS} WHERE id <> '${productId}' AND category_id = '${categoryId}' AND isHidden = 0`; 
        if (!params.isPremium) {
            query += ' AND isExclusif = 0';
        }
        query += ` LIMIT ${maxResult}`;
    }
    return query;
}
  
function findByTagsQuery(productId, tags, params) {
    const tagsCondition = 'tags ' + tags.map((item) => `LIKE '%${item}%' `).join(' OR tags ');
    let query = `SELECT * FROM ${tables.PRODUCTS} WHERE id <> ${productId} AND ( ${tagsCondition} ) AND isHidden = 0`; 
    if (!params.isPremium) {
        query += ' AND isExclusif = 0';
    }
    return query;
}
  
function findPinnedQuery(params) {
    let query = `select * From ${tables.PRODUCTS} where pinned = '1' AND isHidden = 0`;
    if (!params.isPremium) {
        query += ' AND isExclusif = 0';
    }
    return query;
};
  
function findNewQuery(params) {
    let query = `select * From ${tables.PRODUCTS} where isNew = '1' AND isExclusif = 0 AND isHidden = 0`;
    if (!params.isPremium) {
        query += ' AND isExclusif = 0';
    }
    return query;
};
  
function getPromoQuery(params) {
    let query = `select * From ${tables.PRODUCTS} where promo_price IS NOT NULL AND promo_price <> 0 AND promo_price < price AND isExclusif = 0 AND isHidden = 0`;
    if (!params.isPremium) {
        query += ' AND isExclusif = 0';
    }
    return query;
};

module.exports = {
    getSearchQuery,
    findByCategoryQuery,
    getByCategoryQuery,
    findByIdQuery,
    getByIdQuery,
    countByCategoryQuery,
    lastNProductsQuery,
    findInSameCategoryQuery,
    findByTagsQuery,
    findPinnedQuery,
    findNewQuery,
    getPromoQuery
}
