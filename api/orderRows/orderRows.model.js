const sql = require("../config/db.js");
const tables = require("../config/db.tables.js");

//constructor
const OrderRow = function (orderRow) {
    this.id = orderRow.id;
    this.product_id = orderRow.product_id;
    this.variant_id = orderRow.product_id;
    this.quantity = orderRow.quantity;
    this.order_id = orderRow.order_id;
    this.original_price = orderRow.original_price;
    this.price = orderRow.price;
}

OrderRow.getById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.ORDER_ROWS} WHERE id = ${id}`, (err, res) => {
            if(err) {
                console.log("error retrieving order row: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("found order row: \n", res[0].toString());
                    resolve(res[0]);
                } else {
                    console.log(`no order row found with id = ${id}`);
                    resolve();
                }
            }
        });
    });
};

OrderRow.getByOrderId = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.ORDER_ROWS} WHERE order_id = ${id}`, (err, res) => {
            if(err) {
                console.log("error retrieving order rows: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("found order rows: \n", res);
                    resolve(res);
                } else {
                    console.log(`no order row found with order_id = ${id}`);
                    resolve();
                }
            }
        });
    });
};

OrderRow.getByProductId = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.ORDER_ROWS} WHERE product_id = ${id}`, (err, res) => {
            if(err) {
                console.log("error retrieving order rows: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("found order rows: \n", res);
                    resolve(res);
                } else {
                    console.log(`no order row found with product_id = ${id}`);
                    resolve();
                }
            }
        });
    });
};

OrderRow.add = (orderRow) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.ORDER_ROWS} SET ?`,  orderRow, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                console.log("created order row: ", { id: res.insertId, ...orderRow });
                resolve({ id: res.insertId, ...orderRow });
            }
        });
    });
};

OrderRow.addAll = (orderRows) => {
    orderRows = orderRows.map((row) => Object.values(row));
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.ORDER_ROWS}(order_id, product_id, variant_id, quantity, price, original_price, reduction) VALUES ?`,  [orderRows], (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                console.log(res);
                resolve(res);
            }
        });
    });
};

OrderRow.removeById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.ORDER_ROWS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                console.log("deleted order row with id: ", id);
                resolve(res);
            }
        });
    });
};

OrderRow.removeByProductId = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.ORDER_ROWS} WHERE product_id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                console.log("deleted order row with product id: ", id);
                resolve(res);
            }
        });
    });
};

OrderRow.updateById = (id, newRow) => {
    return new Promise((resolve, reject) => {
        const entries = getUpdateOrderRowEntries(newRow);
        const values = getUpdateOrderRowValues(newRow);
        const queryStr = `UPDATE ${tables.ORDER_ROWS} SET ${entries} WHERE id = ${id}`;
        console.log(queryStr);
        sql.query(queryStr, values, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
                return;
              }
      
              if (res.affectedRows == 0) {
                // not found order row with the id
                reject({ kind: "not_found" });
                return;
              }
      
              console.log("updated order row: ", { id, ...newRow });
              resolve({id, ...newRow});
        });
    });
};

OrderRow.updateQuantityById = (id, qty) => {
    return new Promise((resolve, reject) => {
        const queryStr = `UPDATE ${tables.ORDER_ROWS} SET \`quantity\` = '${qty}' WHERE (\`id\` = '${id}')`;
        console.log(queryStr);
        sql.query(queryStr, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
                return;
              }
      
              if (res.affectedRows == 0) {
                // not found order row with the id
                reject({ kind: "not_found" });
                return;
              }
      
              console.log("updated order row quantity: ", { id, qty });
              resolve({id, qty});
        });
    });
};

OrderRow.updateQuantityAndReductionById = (id, qty, reduction) => {
    return new Promise((resolve, reject) => {
        const queryStr = `UPDATE ${tables.ORDER_ROWS} SET \`quantity\` = '${qty}', \`reduction\` = '${reduction}' WHERE (\`id\` = '${id}')`;
        console.log(queryStr);
        sql.query(queryStr, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
                return;
              }
      
              if (res.affectedRows == 0) {
                // not found order row with the id
                reject({ kind: "not_found" });
                return;
              }
      
              console.log("updated order row quantity and reduction: ", { id, qty , reduction});
              resolve({id, qty});
        });
    });
};

function getUpdateOrderRowEntries(row){
    return Object.keys(row).map((e) => `${e} = ?`).join(', ');
}

function getUpdateOrderRowValues(row) {
    return Object.values(row);
}

module.exports = OrderRow;
