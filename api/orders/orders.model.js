const sql = require("../config/db.js");
const tables = require("../config/db.tables.js");

//constructor
const Orders = function(order) {
    this.id = order.id;
    this.order_ref = order.order_ref;
    this.user_id = order.user_id;
    this.order_status = order.order_status;
    this.order_date = order.order_date;
    this.shipped_date = order.shipped_date;
    this.canceled_date = order.canceled_date;
    this.client_message = order.client_message;
    this.coupon_id = order.coupon_id;
    this.delivery_address = order.delivery_address;
    this.delivery_zipcode = order.delivery_zipcode;
    this.delivery_state = order.delivery_state;
    this.delivery_city = order.delivery_city;
    this.delivery_phone = order.delivery_phone;
    this.billing_address = order.billing_address;
    this.billing_zipcode = order.billing_zipcode;
    this.billing_state = order.billing_state;
    this.billing_city = order.billing_city;
    this.billing_phone = order.billing_phone;
    this.creator_id = order.creator_id;
    this.ptype = order.ptype;
    this.payment_status = order.payment_status;
    this.reduction = order.reduction;
}

Orders.getAll = () => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.ORDERS}`, 
      (err, res) => {
        if (err) {
          console.error("error: ", err);
          reject(err);
        } else {
          if (res.length) {
            console.log("[Orders.getAll]: found orders: ", res.length);
            resolve(res);
          } else {
            console.log('no order found.');
            resolve();
          }
        }
      });
    });
};

Orders.getById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.ORDERS} WHERE id = ${id}`,
        (err, res) => {
            if(err) {
                console.log("error retrieving order: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("[getById]: found order with id :", id);
                    resolve(res[0]);
                } else {
                    console.log(`no order found with id = ${id}`);
                    resolve();
                }
            }
        })
    });
}

Orders.findByClientId = (userId) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.ORDERS} WHERE client_id = ${userId}`,
        (err, res) => {
            if(err) {
                console.log("error retrieving orders: ", err);
                reject(err);
            } else {
                if (res.length) {
                    console.log("[Orders.findByClientId]: found orders: \n", res.length);
                    resolve(res);
                } else {
                    console.log(`no order found for client with id = ${userId}`);
                    resolve([]);
                }
            }
        })
    });
}

Orders.findByRef = (ref) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.ORDERS} WHERE ref_id = '${ref}'`, 
      (err, res) => {
        if (err) {
          console.error("error: ", err);
          reject(err);
        } else {
          if (res.length) {
            console.log("found order: ", res[0]);
            resolve(res[0]);
          } else {
            console.log(`no order found with ref = ${ref}`);
            resolve();
          }
        }
      });
    });
};

Orders.findByState = (state) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.ORDERS} WHERE state = '${state}'`, 
      (err, res) => {
        if (err) {
          console.error("error: ", err);
          reject(err);
        } else {
          if (res.length) {
            console.log("found orders: ", res);
            resolve(res);
          } else {
            console.log(`no order found with state = ${state}`);
            resolve();
          }
        }
      });
    });
};

Orders.findByStatus = (status) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.ORDERS} WHERE order_status = '${status}'`, 
      (err, res) => {
        if (err) {
          console.error("error: ", err);
          reject(err);
        } else {
          if (res.length) {
            console.log(`[Orders.findByStatus]: found order with status '${status}': ${res[0]}`);
            resolve(res[0]);
          } else {
            console.log(`no order found with status = ${status}`);
            resolve();
          }
        }
      });
    });
};

Orders.findByCreator = (creatorId) => {
    return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.ORDERS} WHERE creator_id = '${creatorId}'`, 
      (err, res) => {
        if (err) {
          console.error("error: ", err);
          reject(err);
        } else {
          if (res.length) {
            console.log("[Orders.findByCreator]: found order: ", res[0]);
            resolve(res);
          } else {
            console.log(`no order found with creator = ${creatorId}`);
            resolve();
          }
        }
      });
    });
};

Orders.findCreatedBetween = (date1, date2) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ${tables.ORDERS} WHERE order_date between = '${date1}' and '${date2}' order by order_date desc`, 
        (err, res) => {
          if (err) {
            console.error("error: ", err);
            reject(err);
          } else {
            if (res.length) {
              console.log("found orders: ", res);
              resolve(res[0]);
            } else {
              console.log(`no order found between ${date1} and ${date2}`);
              resolve();
            }
          }
        });
      });
};

Orders.findDoneAndPaidByMonth = (yearMonth) => {
  return new Promise((resolve, reject) => {
      sql.query(`SELECT * FROM ${tables.ORDERS} WHERE shipped_date LIKE '%${yearMonth}-%' AND order_status = 'shipped' AND payment_status = '1'`, 
      (err, res) => {
        if (err) {
          reject(err);
        } else {
          if (res.length) {
            resolve(res);
          } else {
            console.log(`no order found for year-month ${yearMonth}`);
            resolve();
          }
        }
      });
    });
};

Orders.findCreatedOrdersByMonth = (yearMonth) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.ORDERS} WHERE order_date LIKE '%${yearMonth}-%'`, 
    (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res.length) {
          resolve(res);
        } else {
          console.log(`no order found for year-month ${yearMonth}`);
          resolve();
        }
      }
    });
  });
};

Orders.findCreatedNotCanceledOrdersByMonth = (yearMonth) => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ${tables.ORDERS} WHERE order_date LIKE '%${yearMonth}-%' AND order_status <> 'canceled'`, 
    (err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res.length) {
          resolve(res);
        } else {
          console.log(`no order found for year-month ${yearMonth}`);
          resolve();
        }
      }
    });
  });
};

Orders.search = (status, payment, ptype) => {
  return new Promise((resolve, reject) => {
    sql.query(getSearchQuery(status, payment, ptype), 
    (err, res) => {
      if (err) {
        console.error("error: ", err);
        reject(err);
      } else {
        if (res.length) {
          console.log(`[Orders.search]: found orders (status = ${status}, payment = ${payment}, ptyep = ${ptype}): ${res.length}`);
          resolve(res);
        } else {
          console.log(`no order found with query = status = ${status}, payment = ${payment}, ptype = ${ptype}`);
          resolve([]);
        }
      }
    });
  });
};

Orders.add = (order) => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO ${tables.ORDERS} SET ?`,  order, (err, res) => {
            if (err) {
            console.log("error: ", err);
            reject(err);
            } else {
            console.log("created order: ", { id: res.insertId, ...order });
            resolve({ id: res.insertId, ...order });
            }
        });
    });
};

Orders.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.ORDERS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }
        
            if (res.affectedRows == 0) {
            // not found order with the id
            reject({ kind: "not_found" });
            }
        
            console.log("deleted order with id: ", id);
            resolve(res);
        });
    });
};

Orders.updateOrderStatus = (id, newStatusData) => {
    return new Promise((resolve, reject) => {
        const entries = getUpdateOrderEntries(newStatusData);
        const values = getUpdateOrderValues(newStatusData);
        const queryStr = `UPDATE ${tables.ORDERS} SET ${entries} WHERE id = ${id}`;
        console.log(queryStr);
        sql.query(queryStr, values, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
                return;
              }
      
              if (res.affectedRows == 0) {
                // not found order with the id
                reject({ kind: "not_found" });
                return;
              }
      
              console.log("updated order status: ", { id, status });
              resolve({id, status});
        });
    });
};

Orders.updateById = (id, newOrder) => {
  return new Promise((resolve, reject) => {
    const entries = getUpdateOrderEntries(newOrder);
    const values = getUpdateOrderValues(newOrder);
    const queryStr = `UPDATE ${tables.ORDERS} SET ${entries} WHERE id = ${id}`;
    console.log(queryStr);
    sql.query(queryStr, values, (err, res) => {
        if (err) {
            console.log("error: ", err);
            reject(err);
            return;
          }
  
          if (res.affectedRows == 0) {
            // not found order with the id
            reject({ kind: "not_found" });
            return;
          }
  
          console.log("updated order: ", { id, ...newOrder });
          resolve({id, ...newOrder});
    });
});
};

function getUpdateOrderEntries(order){
    return Object.keys(order).map((e) => `${e} = ?`).join(', ');
}

function getUpdateOrderValues(order) {
    return Object.values(order);
}

function getSearchQuery(status, payment, ptype) {
  let query = `SELECT ${tables.ORDERS}.*, U.name FROM ${tables.ORDERS} LEFT JOIN ${tables.USERS} AS U ON U.id = ${tables.ORDERS}.client_id `;
  if (status || payment || ptype) {
    query = `${query} WHERE `;
    const criterias = [];
    if (status) {
      criterias.push(`order_status = '${status}'`);
    }
    if (payment !== null) {
      criterias.push(`payment_status = ${payment}`);
    }
    if (ptype) {
      criterias.push(`ptype = '${ptype}'`);
    }
    return `${query}${criterias.join(' AND ')}`;
  }
  return query;
}

Orders.setReduction = (id, value) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.ORDERS} SET ` +
      "reduction = ? " +
      "WHERE id = ? ", 
      [
        value, 
        id
      ], (err, res) => {
        if (err) {
          console.log("Error while setting order reduction, orderId = ", id);
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found order with the id
          reject({ kind: "not_found" });
          return;
        }
        console.log("updated order reduction: ", id);
        resolve({ id: id, reduction: value });
      });
  });
}

module.exports = Orders;
