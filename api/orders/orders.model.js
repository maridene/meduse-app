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
            resolve(res);
          } else {
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
                reject(err);
            } else {
                if (res.length) {
                    resolve(res[0]);
                } else {
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
                reject(err);
            } else {
                if (res.length) {
                    resolve(res);
                } else {
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
            resolve(res[0]);
          } else {
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
            resolve(res);
          } else {
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
            resolve(res[0]);
          } else {
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
            resolve(res);
          } else {
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
              resolve(res[0]);
            } else {
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
          resolve(res);
        } else {
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
              reject(err);
            } else {
              resolve({ id: res.insertId, ...order });
            }
        });
    });
};

Orders.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`DELETE FROM ${tables.ORDERS} WHERE id = ?`, id, (err, res) => {
            if (err) {
                reject(err);
            }
        
            if (res.affectedRows == 0) {
            // not found order with the id
            reject({ kind: "not_found" });
            }
            resolve(res);
        });
    });
};

Orders.updateOrderStatus = (id, newStatusData) => {
    return new Promise((resolve, reject) => {
        const entries = getUpdateOrderEntries(newStatusData);
        const values = getUpdateOrderValues(newStatusData);
        const queryStr = `UPDATE ${tables.ORDERS} SET ${entries} WHERE id = ${id}`;
        sql.query(queryStr, values, (err, res) => {
            if (err) {
                reject(err);
                return;
              }
      
              if (res.affectedRows == 0) {
                // not found order with the id
                reject({ kind: "not_found" });
                return;
              }
              resolve({id, status});
        });
    });
};

Orders.updateById = (id, newOrder) => {
  return new Promise((resolve, reject) => {
    const entries = getUpdateOrderEntries(newOrder);
    const values = getUpdateOrderValues(newOrder);
    const queryStr = `UPDATE ${tables.ORDERS} SET ${entries} WHERE id = ${id}`;
    sql.query(queryStr, values, (err, res) => {
        if (err) {
            reject(err);
            return;
          }
  
          if (res.affectedRows == 0) {
            // not found order with the id
            reject({ kind: "not_found" });
            return;
          }
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
  let query = `SELECT ${tables.ORDERS}.*, A.name AS agentName, U.name FROM ${tables.ORDERS} LEFT JOIN ${tables.USERS} AS U ON U.id = ${tables.ORDERS}.client_id LEFT JOIN ${tables.AGENTS} AS A on A.id = ${tables.ORDERS}.agent_id`;
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
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found order with the id
          reject({ kind: "not_found" });
          return;
        }
        resolve({ id: id, reduction: value });
      });
  });
}

Orders.updateAgent = (id, agentId) => {
  return new Promise((resolve, reject) => {
    sql.query(
      `UPDATE ${tables.ORDERS} SET ` +
      "agent_id = ? " +
      "WHERE id = ? ", 
      [
        agentId, 
        id
      ], (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (res.affectedRows == 0) {
          // not found order with the id
          reject({ kind: "not_found" });
          return;
        }
        resolve({ id: id, agentId});
      });
  });
};

module.exports = Orders;
