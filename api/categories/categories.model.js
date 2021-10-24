const sql = require("../config/db.js");
const tables = require('../config/db.tables.js');

// constructor
const Category = function(category) {
  this.id = category.id;
  this.label = category.label;
  this.description = category.description;
};

Category.create = (newCategory) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.CATEGORIES} SET ?`, newCategory, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve({ id: res.insertId, ...newCategory });
        });
    });
};

Category.findById = (categoryId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.CATEGORIES} WHERE id = ${categoryId}`, (err, res) => {
            if (err) {
                reject(err);
            } else if (res.length) {
                resolve(res[0]);
            } else {
                resolve();
            }
        });
    });
}

Category.getAll = () => {
    const query = `SELECT ${tables.CATEGORIES}.id, ${tables.CATEGORIES}.label, ${tables.CATEGORIES}.description,  COUNT(products.id) AS productscount 
    FROM meduse.${tables.CATEGORIES}
    LEFT JOIN ${tables.PRODUCTS} ON ${tables.CATEGORIES}.id = ${tables.PRODUCTS}.category_id
    GROUP BY ${tables.CATEGORIES}.id
    ORDER BY ${tables.CATEGORIES}.order ASC;`;
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Category.updateById = (id, category) => {
    const query = `UPDATE ${tables.CATEGORIES} SET 
    \`label\` = '${category.label}', 
    \`description\` = '${category.description}' 
    WHERE (\`id\` = '${id}')`;
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            if (err) {
                reject(null, err);
            }
    
            if (res.affectedRows == 0) {
                // not found Category with the id
                reject();
            }
            resolve({ id: id, ...category });
        });
    });
};

Category.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.CATEGORIES} WHERE id = ?`, id, (err, res) => {
            if (err) {
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found Category with the id
                reject();
                return;
            }
            resolve(res);
        });
    });

};

Category.removeAll = result => {
sql.query(`DELETE FROM ${tables.CATEGORIES}`, (err, res) => {
    if (err) {
    result(null, err);
    return;
    }
    result(null, res);
});
};

Category.updateOrderIndex = (id, value) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE ${tables.CATEGORIES} SET \`order\` = '${value}' WHERE (\`id\` = '${id}')`; 
      sql.query(query, (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          if (res.affectedRows == 0) {
            return;
          }
          resolve({ id: id, order: value });
        });
    });
  };


module.exports = Category;