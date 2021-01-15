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
        console.log(newCategory);
        sql.query(`INSERT INTO ${tables.CATEGORIES} SET ?`, newCategory, (err, res) => {
            if (err) {
                console.log("error: ", err);
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
                console.log("error: ", err);
                reject(err);
            } else if (res.length) {
                console.log("found category: ", res[0]);
                resolve(res[0]);
            } else {
                console.log("no category found with id " + categoryId);
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
    console.log(query);
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(null, err);
            }
    
            if (res.affectedRows == 0) {
                // not found Category with the id
                reject();
            }
    
            console.log("updated category: ", { id: id, ...category });
            resolve({ id: id, ...category });
        });
    });
};

Category.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.CATEGORIES} WHERE id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found Category with the id
                reject();
                return;
            }
        
            console.log("deleted category with id: ", id);
            resolve(res);
        });
    });

};

Category.removeAll = result => {
sql.query(`DELETE FROM ${tables.CATEGORIES}`, (err, res) => {
    if (err) {
    console.log("error: ", err);
    result(null, err);
    return;
    }

    console.log(`deleted ${res.affectedRows} categories`);
    result(null, res);
});
};

Category.updateOrderIndex = (id, value) => {
    return new Promise((resolve, reject) => {
        const query = `UPDATE ${tables.CATEGORIES} SET \`order\` = '${value}' WHERE (\`id\` = '${id}')`; 
      sql.query(query, (err, res) => {
          if (err) {
            console.log("Error while updating category order index, categoryId = ", id);
            reject(err);
            return;
          }
          if (res.affectedRows == 0) {
            return;
          }
          console.log("updated category order index: ", id);
          resolve({ id: id, order: value });
        });
    });
  };


module.exports = Category;