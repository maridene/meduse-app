const sql = require("../model/db.js");

// constructor
const Category = function(category) {
  this.id = category.id;
  this.label = category.label;
  this.description = category.description;
};

const tableName = "categories";

Category.create = (newCategory) => {
    return new Promise((resolve, reject) => {
        console.log(newCategory);
        sql.query(`INSERT INTO ${tableName} SET ?`, newCategory, (err, res) => {
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
        sql.query(`SELECT * FROM ${tableName} WHERE id = ${categoryId}`, (err, res) => {
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
    const query = `SELECT ${tableName}.id, ${tableName}.label, ${tableName}.description,  COUNT(products.id) AS productscount 
    FROM meduse.${tableName}
    LEFT JOIN products ON ${tableName}.id = products.category_id
    GROUP BY ${tableName}.id;`
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
    const query = `UPDATE ${tableName} SET 
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
        sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
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
sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
    console.log("error: ", err);
    result(null, err);
    return;
    }

    console.log(`deleted ${res.affectedRows} categories`);
    result(null, res);
});
};


module.exports = Category;