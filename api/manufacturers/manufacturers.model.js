const sql = require("../config/db.js");
const tables = require("../config/db.tables.js");

// constructor
const Manufacturer = function(manufacturer) {
  this.id = manufacturer.id;
  this.name = manufacturer.name;
  this.website = manufacturer.website;
};

Manufacturer.create = (newManufacturer) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.MANUFACTURERS} SET ?`, newManufacturer, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve({ id: res.insertId, ...newManufacturer });
        });
    });
};

Manufacturer.findById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.MANUFACTURERS} WHERE id = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            } else if (res.length) {
                resolve(res[0]);
            } else {
                reject();
            }
        });
    });
}

Manufacturer.getProductsCountForManufacturer = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT count(*) as count FROM ${tables.PRODUCTS} WHERE manufacturerId = ${id}`, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res[0].count);
            }
        });
    });
}

Manufacturer.getAll = () => {
    const query = `SELECT ${tables.MANUFACTURERS}.id, ${tables.MANUFACTURERS}.name, ${tables.MANUFACTURERS}.website,  COUNT(${tables.PRODUCTS}.id) AS productscount 
    FROM meduse.${tables.MANUFACTURERS}
    LEFT JOIN products ON ${tables.MANUFACTURERS}.id = ${tables.PRODUCTS}.manufacturerid
    GROUP BY ${tables.MANUFACTURERS}.id;`
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

Manufacturer.updateById = (id, manufacturer) => {
    const query = `UPDATE ${tables.MANUFACTURERS} SET 
    \`name\` = '${manufacturer.name}', 
    \`website\` = '${manufacturer.website}' 
    WHERE (\`id\` = '${id}')`;
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            if (err) {
                reject(null, err);
            }
    
            if (res.affectedRows == 0) {
                // not found manufacturer with the id
                reject();
            }
            resolve({ id: id, ...manufacturer });
        });
    });
};

Manufacturer.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.MANUFACTURERS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                reject(err);
            }
        
            if (res.affectedRows == 0) {
                // not found manufacturer with the id
                reject();
                return;
            }
            resolve(res);
        });
    });

};

Manufacturer.removeAll = result => {
sql.query(`DELETE FROM ${tables.MANUFACTURERS}`, (err, res) => {
    if (err) {
    result(null, err);
    return;
    }
    result(null, res);
});
};


module.exports = Manufacturer;